import { computed, inject, Injectable, signal } from '@angular/core';
import { Candidate, CandidateDTO } from '../models/candidate.model';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { GetPageRequest } from '../../../core/dto/get-page.dto';
import { GetService } from '../../../core/services/get.service';
import { mapDtoToCandidate } from '../mappers/candidate.mapper';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private getService = inject(GetService);

  // Filter, sort, pagination state (readonly for external access)
  readonly filter = signal<GetPageRequest>({
    entityId: 'Consultants',
    needData: true,
    needRecordCount: true,
    needSchema: false,
    needStyleMap: false,
    pageNumber: 0,
    pageSize: 10,
    which: 'DView',
    whichId: '',
  });
  // State signals (readonly for external access)
  readonly isLoading = signal(false);

  private readonly candidatesRes = toSignal(
    toObservable(this.filter).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((filter) => {
        this.isLoading.set(true);
        if (!filter.whichId) {
          filter.whichId = 'All';
        }
        return this.getService.getPage<CandidateDTO>(filter).pipe(
          tap({
            next: () => this.isLoading.set(false),
            error: () => this.isLoading.set(false),
          }),
        );
      }),
    ),
  );

  readonly candidates = computed(
    () => this.candidatesRes()?.recordSet.records.map(mapDtoToCandidate) ?? [],
  );
  readonly totalRecords = computed(() => this.candidatesRes()?.recordCount ?? 0);
  readonly viewType = signal<'table' | 'card'>('table');
  readonly selectedCandidates = signal<Candidate[]>([]);

  getCandidateById(id: string): Observable<Candidate | null> {
    const candidateRes = this.getService.getItem<CandidateDTO>(id);
    return candidateRes.pipe(
      map((res) => {
        if (res && res.records.length) {
          return res.records[0];
        } else {
          return null;
        }
      }),
      map((res) => (res ? mapDtoToCandidate(res) : null)),
    );
  }

  // /**
  //  * Get candidate pipeline details
  //  */
  // getCandidatePipelineDetails(
  //   candidateId: string,
  //   recruiter: string | null = null,
  //   startDate: Date | null = null,
  //   endDate: Date | null = null,
  // ) {
  //   return this.candidatesApi.getCandidatePipelineDetails(
  //     candidateId,
  //     recruiter,
  //     startDate,
  //     endDate,
  //   );
  // }

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
  updateFilterAndSort(filter: Partial<GetPageRequest>): void {
    this.filter.update((current) => ({ ...current, ...filter }));
  }

  /**
   * Update pagination and reload candidates
   */
  updatePagination(newPagination: Partial<GetPageRequest>): void {
    this.filter.update((current) => ({ ...current, ...newPagination }));
  }

  /**
   * Clear all filters and reload
   */
  clearFilters(): void {
    this.filter.update((current) => ({ ...current, pageNumber: 0 }));
  }
}
