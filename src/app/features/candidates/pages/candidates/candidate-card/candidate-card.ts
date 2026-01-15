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
})
export class CandidateCard {
  readonly candidate = input.required<Candidate>();
}
