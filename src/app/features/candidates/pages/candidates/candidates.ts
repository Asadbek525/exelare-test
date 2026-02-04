import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BreadcrumbService } from '../../../../layouts/main-layout/header/breadcrumb.service';
import { HeaderActionsService } from '../../../../layouts/main-layout/header/header-actions.service';
import { Divider } from 'primeng/divider';
import { TableView } from './table-view/table-view';
import { CardView } from './card-view/card-view';
import { Tooltip } from 'primeng/tooltip';
import { CandidatesService } from '../../services';
import { Paginator } from 'primeng/paginator';
import { Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CandidatesFilter } from '../../services';

@Component({
  selector: 'app-candidates',
  imports: [
    FormsModule,
    Select,
    ProgressSpinner,
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
  private readonly headerActions = inject(HeaderActionsService);
  private readonly destroyRef = inject(DestroyRef);

  // Expose service signals for template binding
  protected readonly loading = this.candidatesService.loading;
  protected readonly candidates = this.candidatesService.candidates;
  protected readonly viewType = this.candidatesService.viewType;
  protected readonly totalRecords = this.candidatesService.totalRecords;
  protected readonly pagination = this.candidatesService.pagination;

  // Local filter values for inputs (not bound to service to avoid re-renders)
  protected readonly localFilter = signal<CandidatesFilter>({});

  // Debounce subject for filter changes
  private readonly filterChange$ = new Subject<CandidatesFilter>();

  // Status options for dropdown
  protected readonly statusOptions = [
    { label: 'All', value: null },
    { label: 'REJECTED', value: 'REJECTED' },
    { label: 'ARCHIVED', value: 'ARCHIVED' },
    { label: 'NEW', value: 'NEW' },
    { label: 'HIRED', value: 'HIRED' },
    { label: 'ON HOLD', value: 'ON HOLD' },
  ];

  // Row options for paginator
  protected readonly rowsPerPageOptions = [10, 25, 50, 100];

  constructor() {
    // Setup debounced filter updates
    this.filterChange$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((filterValues) => {
        this.candidatesService.setFilter(filterValues);
      });
  }

  ngOnInit(): void {
    this.candidatesService.initialize();
    this.breadcrumbService.breadcrumbItems = [
      {
        label: 'Candidates',
        routerLink: '/candidates',
      },
    ];
    this.headerActions.clearActions();
  }

  /**
   * Handle filter change from table-view header (debounced for text, immediate for status)
   */
  protected onTableFilterChange(event: {
    field: keyof CandidatesFilter;
    value: string | null;
  }): void {
    this.localFilter.update((current) => ({
      ...current,
      [event.field]: event.value ?? undefined,
    }));
    if (event.field === 'status') {
      this.candidatesService.setFilter(this.localFilter());
    } else {
      this.filterChange$.next(this.localFilter());
    }
  }

  /**
   * Handle pagination change
   */
  protected onPageChange(event: { first?: number; rows?: number }): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.rows;
    const page = Math.floor(first / rows) + 1;
    this.candidatesService.updatePagination({ page, pageSize: rows });
  }

  /**
   * Get first index for paginator
   */
  protected get first(): number {
    const p = this.pagination();
    return (p.page - 1) * p.pageSize;
  }

  /**
   * Get rows for paginator
   */
  protected get rows(): number {
    return this.pagination().pageSize;
  }

  /**
   * 1-based page report text: "Showing 1-10 of 45"
   */
  protected pageReportText(): string {
    const total = this.totalRecords();
    if (total === 0) return 'Showing 0 of 0';
    const start = this.first + 1;
    const end = Math.min(this.first + this.rows, total);
    return `Showing ${start}-${end} of ${total}`;
  }
}
