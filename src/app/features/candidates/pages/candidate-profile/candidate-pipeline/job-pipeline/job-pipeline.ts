import { Component, computed, input } from '@angular/core';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Timeline } from 'primeng/timeline';
import { PipelineJob, PipelineStage, StageType } from '../../../../models/candidate.model';
import { Tag } from 'primeng/tag';
import { SEVERITY_MAP } from '../../../../shared/utils';
import { DurationPipe } from '../../../../../../shared/pipes/duration-pipe';

@Component({
  selector: 'app-job-pipeline',
  imports: [Button, DatePipe, PrimeTemplate, Timeline, Tag, DurationPipe],
  templateUrl: './job-pipeline.html',
  styleUrl: './job-pipeline.css',
})
export class JobPipeline {
  job = input.required<PipelineJob>();
  readonly lastStage = computed(() => this.job()?.stages[this.job()?.stages.length - 1]);

  readonly jobStagesWithIndex = computed(() => {
    const stages = this.job()?.stages;
    const stagesWithIndex: (Partial<PipelineStage> & { index: number })[] = [];
    stages?.forEach((stage, index) => {
      stagesWithIndex.push({
        ...stage,
        index,
      });
    });
    stagesWithIndex.push({
      Stage: 'Placed',
      index: -1,
    });
    return stagesWithIndex;
  });

  getColor(stage: StageType) {
    switch (stage) {
      case 'Received':
        return 'var(--color-blue-500)';
      case 'Potential':
        return 'var(--color-green-500)';
      case 'Interview':
        return 'var(--color-orange-500)';
      case 'Offer':
        return 'var(--color-red-500)';
      case 'Placed':
        return 'var(--color-gray-500)';
      default:
        return null;
    }
  }

  protected readonly SEVERITY_MAP = SEVERITY_MAP;
}
