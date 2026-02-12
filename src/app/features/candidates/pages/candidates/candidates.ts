import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { Divider } from 'primeng/divider';
import { TableView } from './table-view/table-view';
import { CardView } from './card-view/card-view';
import { Tooltip } from 'primeng/tooltip';
import { CandidatesService } from '../../services';
import { Paginator, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-candidates',
  imports: [
    FormsModule,
    Select,
    Button,
    TableModule,
    Divider,
    TableView,
    CardView,
    Tooltip,
    Paginator,
  ],
  templateUrl: './candidates.html',
  styleUrl: './candidates.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Candidates {
  protected readonly candidatesService = inject(CandidatesService);
  private readonly router = inject(Router);

  // Route parameter input bound via withComponentInputBinding()
  whichId = input.required<string>();

  // Expose service signals for template binding
  protected readonly candidates = this.candidatesService.candidates;
  protected readonly viewType = this.candidatesService.viewType;
  protected readonly totalRecords = this.candidatesService.totalRecords;
  readonly filter = this.candidatesService.filter;

  // Row options for paginator
  protected readonly rowsPerPageOptions = [10, 25, 50, 100];

  constructor() {
    effect(() => {
      const whichId = this.whichId();
      this.candidatesService.filter.update((f) => ({ ...f, whichId }));
    });
  }

  /**
   * Handle pagination change
   */
  protected onPageChange(event: PaginatorState): void {
    const pageSize = event.rows ?? 10;
    const pageNumber = event.page ?? 0;
    this.candidatesService.updatePagination({ pageNumber, pageSize });
  }

  //  * 1-based page report text: "Showing 1-10 of 45"
  //  */
  // protected pageReportText = computed((): string => {
  //   const total = this.totalRecords();
  //   if (total === 0) return 'Showing 0 of 0';
  //   const start = pagination.page * pagination.pageSize + 1;
  //   const end = Math.min(start + pagination.pageSize - 1, total);
  //   return `Showing ${start}-${end} of ${total}`;
  // });
  protected categoryOptions: { label: string; value: string }[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Added By Me', value: 'AddedByMe' },
    { label: 'Task List', value: 'MyDailyCallTaskList' },
    { label: 'Opened By Me', value: 'OpenedByMe' },
    { label: 'Duplicates - Email', value: 'Duplicates' },
  ];

  // Selected category bound to dropdown
  protected selectedCategory = computed(() => this.filter().whichId);

  /**
   * Handle category selection change
   */
  protected async onCategoryChange(value: string) {
    await this.router.navigate(['/Consultants', value]);
  }
}
