import { Component, input } from '@angular/core';
import { Candidate } from '../../../models/candidate.model';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { TableModule } from 'primeng/table';
import { CandidateCard } from './candidate-card/candidate-card';

@Component({
  selector: 'app-card-view',
  imports: [CdkDropList, TableModule, CandidateCard],
  templateUrl: './card-view.html',
  styleUrl: './card-view.css',
})
export class CardView {
  candidates = input.required<Candidate[]>();
}
