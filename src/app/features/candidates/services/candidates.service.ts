import { inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  CandidatesApi,
  CandidatesFilter,
  CandidatesPagination,
  CandidatesSort,
} from './candidates-api';
import { Candidate } from '../models/candidate.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly candidatesApi = inject(CandidatesApi);
  private readonly messageService = inject(MessageService);

  // State signals (readonly for external access)
  readonly candidates = signal<Candidate[]>([]);
  readonly loading = signal(false);
  readonly totalRecords = signal(0);
  readonly viewType = signal<'table' | 'card'>('table');
  readonly selectedCandidates = signal<Candidate[]>([]);

  // Filter, sort, pagination state (readonly for external access)
  readonly filter = signal<CandidatesFilter>({});
  readonly sort = signal<CandidatesSort | undefined>(undefined);
  readonly pagination = signal<CandidatesPagination>({ page: 1, pageSize: 10 });

  /**
   * Load candidates from API with current filter, sort, and pagination
   * This is private - use the update methods to trigger reloads
   */
  private loadCandidates(): void {
    this.loading.set(true);
    this.candidatesApi.getCandidates(this.filter(), this.sort(), this.pagination()).subscribe({
      next: (res) => {
        this.candidates.set(res.records);
        this.totalRecords.set(res.totalRecords ?? res.records.length);
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

  /**
   * Initialize/refresh the candidates list
   * Call this once when the component mounts
   */
  initialize(): void {
    this.loadCandidates();
  }

  /**
   * Get candidate by ID - returns from loaded candidates or fetches if needed
   */
  getCandidateById(id: string): Observable<Candidate | null> {
    const candidates = this.candidates();
    if (candidates.length > 0) {
      const candidate = candidates.find((c) => c.ConsIntID === id) || null;
      return of(candidate);
    }
    // If candidates not loaded, fetch from API
    return this.candidatesApi.getCandidateById(id);
  }

  /**
   * Get candidate pipeline details
   */
  getCandidatePipelineDetails(
    candidateId: string,
    recruiter: string | null = null,
    startDate: Date | null = null,
    endDate: Date | null = null,
  ) {
    return this.candidatesApi.getCandidatePipelineDetails(
      candidateId,
      recruiter,
      startDate,
      endDate,
    );
  }

  /**
   * Toggle candidate selection
   */
  toggleCandidateSelection(candidate: Candidate): void {
    const current = this.selectedCandidates();
    const index = current.findIndex((c) => c.ConsIntID === candidate.ConsIntID);

    if (index === -1) {
      this.selectedCandidates.set([...current, candidate]);
    } else {
      this.selectedCandidates.set(current.filter((c) => c.ConsIntID !== candidate.ConsIntID));
    }
  }

  /**
   * Check if a candidate is selected
   */
  isSelected(candidate: Candidate): boolean {
    return this.selectedCandidates().some((c) => c.ConsIntID === candidate.ConsIntID);
  }

  /**
   * Set selected candidates directly (for p-table binding)
   */
  setSelectedCandidates(candidates: Candidate[]): void {
    this.selectedCandidates.set(candidates);
  }

  /**
   * Update filter and reload candidates
   * Automatically resets to first page
   */
  updateFilter(newFilter: Partial<CandidatesFilter>): void {
    this.filter.update((current) => ({ ...current, ...newFilter }));
    this.pagination.update((current) => ({ ...current, page: 1 }));
    this.loadCandidates();
  }

  /**
   * Set entire filter (replaces current filter) and reload candidates
   * Automatically resets to first page
   */
  setFilter(filter: CandidatesFilter): void {
    this.filter.set(filter);
    this.pagination.update((current) => ({ ...current, page: 1 }));
    this.loadCandidates();
  }

  /**
   * Update sort and reload candidates
   */
  updateSort(newSort: CandidatesSort | undefined): void {
    this.sort.set(newSort);
    this.loadCandidates();
  }

  /**
   * Update pagination and reload candidates
   */
  updatePagination(newPagination: Partial<CandidatesPagination>): void {
    this.pagination.update((current) => ({ ...current, ...newPagination }));
    this.loadCandidates();
  }

  /**
   * Clear all filters and reload
   */
  clearFilters(): void {
    this.filter.set({});
    this.pagination.update((current) => ({ ...current, page: 1 }));
    this.loadCandidates();
  }
}
