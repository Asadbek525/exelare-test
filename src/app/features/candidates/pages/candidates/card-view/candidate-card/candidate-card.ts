import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Candidate } from '../../../../models/candidate.model';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';
import { DraggedData } from '../../../../../../shared/components/tree';
import { Checkbox } from 'primeng/checkbox';
import { CandidatesService } from '../../../../services';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { EntityIds } from '../../../../../../core/services/menu-builder.service';

@Component({
  selector: 'app-candidate-card',
  imports: [
    Card,
    Avatar,
    Tag,
    Skeleton,
    CdkDrag,
    CdkDragPreview,
    CdkDragPlaceholder,
    Checkbox,
    FormsModule,
    Button,
  ],
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

  host: {
    class: 'cursor-grab active:cursor-grabbing',
    '[class.selected]': 'isSelected()',
  },
})
export class CandidateCard {
  private readonly candidatesService = inject(CandidatesService);

  readonly candidate = input.required<Candidate>();

  protected readonly isSelected = computed(() =>
    this.candidatesService.isSelected(this.candidate()),
  );

  protected readonly statusSeverity = computed(() => {
    const status = this.candidate().Status?.toUpperCase();
    switch (status) {
      case 'HIRED':
      case 'ACTIVE':
        return 'success';
      case 'NEW':
        return 'info'; // or custom class for purple
      case 'ON HOLD':
        return 'warn';
      case 'ARCHIVED':
      case 'REJECTED':
        return 'secondary';
      default:
        return 'secondary';
    }
  });

  protected readonly dragData = computed<DraggedData>(() => {
    const c = this.candidate();
    return {
      _source: 'external',
      id: c.ConsIntID,
      label: c.FullName,
      type: EntityIds.Consultants,
    };
  });

  protected onSelectionToggle(): void {
    this.candidatesService.toggleCandidateSelection(this.candidate());
  }
}
