import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Candidate } from '../../../models/candidate.model';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { DragService } from '../../../../../shared/components/tree/drag-service';

@Component({
  selector: 'app-candidate-card',
  imports: [Card, Avatar, Tag, Skeleton],
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    draggable: 'true',
    class: 'cursor-grab active:cursor-grabbing',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
  },
})
export class CandidateCard {
  readonly candidate = input.required<Candidate>();
  private readonly dragService = inject(DragService);

  onDragStart(event: DragEvent) {
    const c = this.candidate();
    if (event.dataTransfer && c) {
      const dragData = {
        ...c,
        type: 'candidate',
      };
      this.dragService.draggedData.set(dragData);
      event.dataTransfer.setData('application/json', JSON.stringify(dragData));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
    this.dragService.draggedData.set(null);
  }
}
