import { Component, computed, inject, input, signal } from '@angular/core';
import { CandidatesApi } from '../../../services/candidates-api';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { PipelineStage, StageType } from '../../../models/candidate.model';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-candidate-pipeline',
  imports: [Select, FormsModule, TableModule, Tag, DatePipe],
  templateUrl: './candidate-pipeline.html',
  styleUrl: './candidate-pipeline.css',
  standalone: true,
})
export class CandidatePipeline {
  candidateId = input.required<string>();
  private readonly candidatesApi = inject(CandidatesApi);

  private readonly pipelineStages$ = toObservable(this.candidateId).pipe(
    switchMap((id) => this.candidatesApi.getCandidatePipelineDetails(id)),
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
  protected selectedRecruiter = signal('');
  protected readonly Object = Object;

  getSeverity(
    stage: StageType,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
    switch (stage) {
      case 'Received':
        return 'info';
      case 'Potential':
        return 'success';
      case 'Interview':
        return 'warn';
      case 'Offer':
        return 'danger';
      case 'Placed':
        return 'secondary'; // Grey
      default:
        return null;
    }
  }
}
