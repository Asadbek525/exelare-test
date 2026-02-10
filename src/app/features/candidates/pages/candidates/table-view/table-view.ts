import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CandidateRow } from './candidate-row/candidate-row';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { Checkbox } from 'primeng/checkbox';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Candidate } from '../../../models/candidate.model';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { CandidatesService } from '../../../services';
import { FormsModule } from '@angular/forms';
import { GetPageRequest, IFilterStatement } from '../../../../../core/dto/get-page.dto';
import { FilterMetadata } from 'primeng/api';
import { DraggedEntityData } from '../../../../../shared/components/tree';
import { EntityIds } from '../../../../../core/services/menu-builder.service';

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
  protected readonly isLoading = this.candidatesService.isLoading;

  // Status options for dropdown filter
  protected readonly statusOptions = [
    { label: 'All', value: null },
    { label: 'REJECTED', value: 'REJECTED' },
    { label: 'ARCHIVED', value: 'ARCHIVED' },
    { label: 'NEW', value: 'NEW' },
    { label: 'HIRED', value: 'HIRED' },
    { label: 'ON HOLD', value: 'ON HOLD' },
  ];

  protected dragData(candidate: Candidate): DraggedEntityData {
    return {
      _source: 'external',
      id: candidate.ConsIntID,
      label: candidate.FullName,
      type: EntityIds.Consultants,
    };
  }

  protected onSelectionChange(candidates: Candidate[]): void {
    this.candidatesService.setSelectedCandidates(candidates);
  }

  // Valid column fields that can be filtered
  private readonly validFilterFields = new Set([
    'FirstName',
    'LastName',
    'Status',
    'JobTitle',
    'PrimarySkills',
    'City',
    'MobilePhone',
    'EMail1',
  ]);

  protected loadCandidates(event: TableLazyLoadEvent): void {
    const update: Partial<GetPageRequest> = {};

    // Build filter statement from p-table filters
    if (event.filters) {
      const filterItems: IFilterStatement[] = [];

      for (const [field, filterMeta] of Object.entries(event.filters)) {
        // Skip invalid/unknown fields like 'global'
        if (!this.validFilterFields.has(field)) {
          continue;
        }

        const meta = Array.isArray(filterMeta) ? filterMeta[0] : filterMeta;
        if (meta?.value != null && meta.value !== '') {
          filterItems.push(this.buildFilterItem(field, meta));
        }
      }

      if (filterItems.length > 0) {
        update.filterBy = {
          oper: 'AND',
          items: filterItems,
        };
      } else {
        // Clear filter when all filters are removed
        update.filterBy = undefined;
      }
    }

    // Build order by statement from p-table sort
    if (event.sortField) {
      const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
      update.orderBy = {
        items: [{ oper: sortOrder, fieldName: event.sortField as string }],
      };
    }

    // Update pagination
    if (event.first != null && event.rows != null) {
      update.pageNumber = Math.floor(event.first / event.rows);
      update.pageSize = event.rows;
    }

    this.candidatesService.updateFilterAndSort(update);
  }

  private buildFilterItem(field: string, meta: FilterMetadata): IFilterStatement {
    const matchMode = meta.matchMode ?? 'contains';
    const value = String(meta.value);
    let oper: string;
    let fieldValue1: string;

    switch (matchMode) {
      case 'equals':
        oper = 'Eq';
        fieldValue1 = `'${value}'`;
        break;
      case 'notEquals':
        oper = 'Ne';
        fieldValue1 = `'${value}'`;
        break;
      case 'startsWith':
        oper = 'Like';
        fieldValue1 = `'${value}%'`;
        break;
      case 'endsWith':
        oper = 'Like';
        fieldValue1 = `'%${value}'`;
        break;
      case 'contains':
      default:
        oper = 'Like';
        fieldValue1 = `'%${value}%'`;
        break;
    }

    return {
      oper,
      fieldName: `Consultants.${field}`,
      fieldValue1,
      items: [],
    };
  }

  protected rowTrackByFn = (index: number, item: Candidate) => {
    return item.ConsIntID;
  };
}
