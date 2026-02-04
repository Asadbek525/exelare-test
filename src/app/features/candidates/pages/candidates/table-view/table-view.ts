import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CandidateRow } from './candidate-row/candidate-row';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { Checkbox } from 'primeng/checkbox';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Candidate } from '../../../models/candidate.model';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import type { CandidatesFilter, CandidatesSort } from '../../../services';
import { CandidatesService } from '../../../services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-view',
  imports: [
    CandidateRow,
    CdkDrag,
    CdkDragPreview,
    CdkDropList,
    Checkbox,
    TableModule,
    CdkDragPlaceholder,
    Select,
    InputText,
    FormsModule,
  ],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableView {
  private readonly candidatesService = inject(CandidatesService);

  // Service signals
  protected readonly candidates = this.candidatesService.candidates;
  protected readonly selectedCandidates = this.candidatesService.selectedCandidates;

  // Status options for dropdown filter
  protected readonly statusOptions = [
    { label: 'All', value: null },
    { label: 'REJECTED', value: 'REJECTED' },
    { label: 'ARCHIVED', value: 'ARCHIVED' },
    { label: 'NEW', value: 'NEW' },
    { label: 'HIRED', value: 'HIRED' },
    { label: 'ON HOLD', value: 'ON HOLD' },
  ];

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

  protected loadCandidates(event: TableLazyLoadEvent): void {
    // Extract filters from p-table event
    const filter: CandidatesFilter = {};

    if (event.filters) {
      const filters = event.filters;

      // Map p-table filter fields to CandidatesFilter keys
      const filterMapping: Record<string, keyof CandidatesFilter> = {
        FirstName: 'firstName',
        LastName: 'lastName',
        Status: 'status',
        JobTitle: 'jobTitle',
        PrimarySkills: 'primarySkills',
        City: 'city',
        MobilePhone: 'mobile',
        EMail1: 'email',
      };

      for (const [tableField, filterKey] of Object.entries(filterMapping)) {
        const filterValue = filters[tableField];
        if (filterValue) {
          const value = Array.isArray(filterValue) ? filterValue[0]?.value : filterValue.value;
          if (value) {
            filter[filterKey] = value;
          }
        }
      }
    }

    // Extract sort from p-table event
    let sort: CandidatesSort | undefined;
    if (event.sortField && typeof event.sortField === 'string') {
      sort = {
        field: event.sortField as keyof Candidate,
        order: event.sortOrder === -1 ? 'desc' : 'asc',
      };
    }

    // Update service with filter and sort together (single reload)
    this.candidatesService.updateFilterAndSort(filter, sort);
  }

  protected rowTrackByFn = (index: number, item: Candidate) => {
    return item.ConsIntID;
  };
}
