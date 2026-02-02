import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Candidate } from '../../../models/candidate.model';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';
import { DraggedData } from '../../../../../shared/components/tree/drag-service';

@Component({
  selector: 'app-candidate-card',
  imports: [Card, Avatar, Tag, Skeleton, CdkDrag, CdkDragPreview, CdkDragPlaceholder],
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'cursor-grab active:cursor-grabbing',
  },
})
export class CandidateCard {
  readonly candidate = input.required<Candidate>();

  protected readonly dragData = computed<DraggedData>(() => {
    const c = this.candidate();
    return {
      id: c.ConsIntID,
      label: c.FullName,
      type: 'candidate',
      ...c,
    };
  });
}
