import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BreadcrumbService } from '../../../../layouts/main-layout/header/breadcrumb.service';
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
  standalone: true,
})
export class Candidates implements OnInit {
  protected readonly candidatesService = inject(CandidatesService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  // Expose service signals for template binding
  protected readonly candidates = this.candidatesService.candidates;
  protected readonly viewType = this.candidatesService.viewType;
  protected readonly totalRecords = this.candidatesService.totalRecords;
  readonly filter = this.candidatesService.filter;

  // Row options for paginator
  protected readonly rowsPerPageOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbItems = [
      {
        label: 'Candidates',
        routerLink: '/candidates',
      },
    ];
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
  protected selectedCategory = this.filter().whichId;

  /**
   * Handle category selection change
   */
  protected onCategoryChange(value: string): void {
    this.candidatesService.updateFilterAndSort({ whichId: value, pageNumber: 0 });
  }
}
