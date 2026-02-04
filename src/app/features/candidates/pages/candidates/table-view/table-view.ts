import { Component, computed, inject, input, output } from '@angular/core';
import { CandidateRow } from './candidate-row/candidate-row';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { Checkbox } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { Candidate } from '../../../models/candidate.model';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { CandidatesService } from '../../../services';
import type { CandidatesFilter } from '../../../services';

@Component({
  selector: 'app-table-view',
  imports: [
    CandidateRow,
    CdkDrag,
    CdkDragPreview,
    CdkDropList,
    Checkbox,
    TableModule,
    FormsModule,
    CdkDragPlaceholder,
    InputText,
    Select,
  ],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
})
export class TableView {
  private readonly candidatesService = inject(CandidatesService);

  readonly filterValues = input.required<CandidatesFilter>();
  readonly statusOptions = input.required<{ label: string; value: string | null }[]>();
  readonly filterChange = output<{ field: keyof CandidatesFilter; value: string | null }>();

  // Service signals
  protected readonly candidates = this.candidatesService.candidates;
  protected readonly sort = this.candidatesService.sort;
  protected readonly selectedCandidates = this.candidatesService.selectedCandidates;

  // Sort state for p-table binding
  protected readonly sortField = computed(() => this.sort()?.field ?? null);
  protected readonly sortOrder = computed(() => (this.sort()?.order === 'desc' ? -1 : 1));

  protected dragData(candidate: Candidate) {
    return {
      id: candidate.ConsIntID,
      label: candidate.FullName,
      type: 'candidate',
      ...candidate,
    };
  }

  protected onSelectionChange(candidates: Candidate[]): void {
    this.candidatesService.setSelectedCandidates(candidates);
  }

  /**
   * Handle sort event from p-table
   */
  protected onSort(event: { field: string; order: number }): void {
    const currentSort = this.sort();
    const newSortField = event.field as keyof Candidate;
    const newSortOrder = event.order === 1 ? 'asc' : 'desc';

    // Only update if sort actually changed
    if (currentSort?.field !== newSortField || currentSort?.order !== newSortOrder) {
      this.candidatesService.updateSort({ field: newSortField, order: newSortOrder });
    }
  }

  protected onFilterChange(field: keyof CandidatesFilter, value: string | null): void {
    this.filterChange.emit({ field, value: value || null });
  }
}
