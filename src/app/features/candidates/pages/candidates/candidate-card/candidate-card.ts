import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Candidate } from '../../../models/candidate.model';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';

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

  onDragStart(event: DragEvent) {
    const c = this.candidate();
    if (event.dataTransfer && c) {
      const dragData = {
        id: c.ConsIntID,
        name: c.FullName,
      };
      event.dataTransfer.setData('application/json', JSON.stringify(dragData));
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragEnd(event: DragEvent) {
    // Reset any drag state if needed
    console.log('Drag ended');
    console.log(event);
  }
}
