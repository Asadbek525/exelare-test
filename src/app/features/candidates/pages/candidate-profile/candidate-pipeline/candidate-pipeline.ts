import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { CandidatesService } from '../../../services';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { PipelineJob, PipelineStage } from '../../../models/candidate.model';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { DatePicker } from 'primeng/datepicker';
import { Divider } from 'primeng/divider';
import { Button } from 'primeng/button';
import { JobPipeline } from './job-pipeline/job-pipeline';
import { SEVERITY_MAP } from '../../../shared/utils';

@Component({
  selector: 'app-candidate-pipeline',
  imports: [
    Select,
    FormsModule,
    TableModule,
    Tag,
    DatePipe,
    Avatar,
    DatePicker,
    Divider,
    JobPipeline,
    Button,
  ],
  templateUrl: './candidate-pipeline.html',
  styleUrl: './candidate-pipeline.css',
  standalone: true,
})
export class CandidatePipeline {
  candidateId = input.required<string>();
  private readonly candidatesService = inject(CandidatesService);

  private readonly filter = computed(() => {
    return {
      id: this.candidateId(),
      recruiter: this.selectedRecruiter(),
      startDate: this.rangeDates()[0],
      endDate: this.rangeDates()[1],
    };
  });
  private readonly pipelineStages$ = toObservable(this.filter).pipe(
    switchMap(({ id, recruiter, startDate, endDate }) =>
      this.candidatesService.getCandidatePipelineDetails(id, recruiter, startDate, endDate),
    ),
  );

  readonly pipelineStages = toSignal(this.pipelineStages$);
  readonly stagesByJob = computed(() => {
    const stages = this.pipelineStages();
    const stagesByJob: Record<string, PipelineStage[]> = {};
    stages?.forEach((stage) => {
      if (!stagesByJob[stage.Requirement]) {
        stagesByJob[stage.Requirement] = [];
      }
      stagesByJob[stage.Requirement].push(stage);
    });
    for (const job in stagesByJob) {
      stagesByJob[job].sort((a, b) => {
        return a.DateAndTime.getTime() - b.DateAndTime.getTime();
      });
    }
    return stagesByJob;
  });

  readonly currentJob = signal<PipelineJob | null>(null);

  readonly pipelineJobs = computed(() => {
    const jobStages = this.stagesByJob();
    const pipelineJobs = [];
    for (const stages of Object.values(jobStages)) {
      if (stages)
        pipelineJobs.push({
          job: stages[0].Requirement,
          company: stages[0].Company,
          jobTitle: stages[0].JobTitle,
          contact: stages[0].Contact,
          stage: stages[stages.length - 1].Stage,
          lastUpdated: stages[stages.length - 1].DateAndTime,
          stages,
        });
    }
    return pipelineJobs;
  });

  protected recruiters = computed(() => {
    const stages = this.pipelineStages();
    const recruitersSet = new Set<string>();
    stages?.forEach((stage) => {
      recruitersSet.add(stage.Contact);
    });
    return Array.from(recruitersSet);
  });
  protected selectedRecruiter = signal<string | null>(null);
  protected rangeDates: WritableSignal<Date[]> = signal([]);

  protected readonly SEVERITY_MAP = SEVERITY_MAP;
  viewAll = signal(false);

  protected toggleViewAll() {
    this.viewAll.update((v) => !v);
  }
}
