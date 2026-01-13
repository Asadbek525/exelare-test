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
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { CandidatesApi } from '../../services/candidates-api';
import { Candidate } from '../../models/candidate.model';
import { CandidateCard } from '../../components/candidate-card/candidate-card';
import { BreadcrumbService } from '../../../../layouts/main-layout/header/breadcrumb.service';

@Component({
  selector: 'app-candidates',
  imports: [
    FormsModule,
    RouterLink,
    IconField,
    InputIcon,
    InputText,
    Select,
    ProgressSpinner,
    Button,
    CandidateCard,
  ],
  templateUrl: './candidates.html',
  styleUrl: './candidates.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Candidates implements OnInit {
  private readonly candidatesApi = inject(CandidatesApi);
  private readonly messageService = inject(MessageService);
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly availabilityFilter = signal<string>('all');

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
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.availabilityFilter.set('all');
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
