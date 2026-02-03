import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Checkbox } from 'primeng/checkbox';
import { CandidatesApi } from '../../services/candidates-api';
import { Candidate } from '../../models/candidate.model';
import { BreadcrumbService } from '../../../../layouts/main-layout/header/breadcrumb.service';
import { HeaderActionsService } from '../../../../layouts/main-layout/header/header-actions.service';
import { CandidateRow } from './candidate-row/candidate-row';

@Component({
  selector: 'app-candidates',
  imports: [
    FormsModule,
    InputText,
    Select,
    ProgressSpinner,
    Button,
    TableModule,
    Checkbox,
    CandidateRow,
    RouterLink,
  ],
  templateUrl: './candidates.html',
  styleUrl: './candidates.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Candidates implements OnInit {
  private readonly candidatesApi = inject(CandidatesApi);
  private readonly messageService = inject(MessageService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly headerActions = inject(HeaderActionsService);

  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly availabilityFilter = signal<string>('all');

  // Selection state
  protected readonly selectedCandidates = signal<Candidate[]>([]);

  // Pagination state
  protected readonly first = signal(0);
  protected readonly rows = signal(10);
  protected readonly rowsPerPageOptions = [10, 25, 50, 100];

  protected readonly availabilityOptions = [
    { label: 'All', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Not Available', value: 'unavailable' },
  ];

  protected readonly filteredCandidates = computed(() => {
    let result = this.candidates();

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(
        (c) =>
          c.FullName?.toLowerCase().includes(query) ||
          c.JobTitle?.toLowerCase().includes(query) ||
          c.CompanyName?.toLowerCase().includes(query) ||
          c.PrimarySkills?.some((skill) => skill.toLowerCase().includes(query)),
      );
    }

    // Filter by availability
    const availability = this.availabilityFilter();
    if (availability === 'available') {
      result = result.filter((c) => c.Available);
    } else if (availability === 'unavailable') {
      result = result.filter((c) => !c.Available);
    }

    return result;
  });

  ngOnInit(): void {
    this.loadCandidates();
    this.breadcrumbService.breadcrumbItems = [
      {
        label: 'Candidates',
        routerLink: '/candidates',
      },
    ];
    this.headerActions.clearActions();
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.availabilityFilter.set('all');
  }

  protected isSelected(candidate: Candidate): boolean {
    return this.selectedCandidates().some((c) => c.ConsIntID === candidate.ConsIntID);
  }

  protected toggleSelection(candidate: Candidate, selected: boolean): void {
    if (selected) {
      this.selectedCandidates.set([...this.selectedCandidates(), candidate]);
    } else {
      this.selectedCandidates.set(
        this.selectedCandidates().filter((c) => c.ConsIntID !== candidate.ConsIntID),
      );
    }
  }

  private loadCandidates(): void {
    this.loading.set(true);
    this.candidatesApi.getCandidates().subscribe({
      next: (res) => {
        this.candidates.set(res.records);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Failed to load candidates',
        });
      },
    });
  }
}
