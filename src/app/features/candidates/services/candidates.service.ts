import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CandidatesApi,
  CandidatesFilter,
  CandidatesPagination,
  CandidatesSort,
} from './candidates-api';
import { Candidate } from '../models/candidate.model';
import { combineLatest, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly candidatesApi = inject(CandidatesApi);

  // Filter, sort, pagination state (readonly for external access)
  readonly filter = signal<CandidatesFilter>({});
  readonly sort = signal<CandidatesSort | undefined>(undefined);
  readonly pagination = signal<CandidatesPagination>({ page: 0, pageSize: 10 });

  // State signals (readonly for external access)
  private readonly candidatesRes = toSignal(
    combineLatest([
      toObservable(this.filter),
      toObservable(this.sort),
      toObservable(this.pagination),
    ]).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(([filter, sort, pagination]) => {
        return this.candidatesApi.getCandidates(filter, sort, pagination);
      }),
    ),
  );
  readonly candidates = computed(() => this.candidatesRes()?.records ?? []);
  readonly totalRecords = computed(() => this.candidatesRes()?.totalRecords ?? 0);
  readonly viewType = signal<'table' | 'card'>('table');
  readonly selectedCandidates = signal<Candidate[]>([]);

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
   * Update filter and sort together with a single reload (for p-table lazy load)
   * Automatically resets to first page when filter changes
   */
  updateFilterAndSort(filter: CandidatesFilter, sort: CandidatesSort | undefined): void {
    this.filter.set(filter);
    this.sort.set(sort);
    this.pagination.update((current) => ({ ...current, page: 0 }));
  }

  /**
   * Update pagination and reload candidates
   */
  updatePagination(newPagination: Partial<CandidatesPagination>): void {
    this.pagination.update((current) => ({ ...current, ...newPagination }));
  }

  /**
   * Clear all filters and reload
   */
  clearFilters(): void {
    this.filter.set({});
    this.pagination.update((current) => ({ ...current, page: 0 }));
  }
}
