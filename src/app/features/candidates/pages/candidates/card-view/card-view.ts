import { Component, inject } from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { TableModule } from 'primeng/table';
import { CandidateCard } from './candidate-card/candidate-card';
import { CandidatesService } from '../../../services';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-card-view',
  imports: [CdkDropList, TableModule, CandidateCard, ProgressSpinner],
  templateUrl: './card-view.html',
  styleUrl: './card-view.css',
})
export class CardView {
  private readonly candidatesService = inject(CandidatesService);

  // Get candidates directly from service
  protected readonly candidates = this.candidatesService.candidates;
  protected readonly isLoading = this.candidatesService.isLoading;
}
