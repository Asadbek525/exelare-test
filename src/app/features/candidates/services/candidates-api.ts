import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Candidate,
  CandidateDTO,
  CandidatesResponse,
  PipelineStage,
  PipelineStageDTO,
} from '../models/candidate.model';
import { map, Observable } from 'rxjs';
import { mapDtoToCandidate, mapDtoToPipelineStage } from '../mappers/candidate.mapper';

export interface CandidatesFilter {
  availability?: 'all' | 'available' | 'unavailable';
  status?: string;
  jobTitle?: string;
  city?: string;
  state?: string;
  skills?: string[];
  // Additional column-specific filters
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  primarySkills?: string;
}

export interface CandidatesSort {
  field: keyof Candidate;
  order: 'asc' | 'desc';
}

export interface CandidatesPagination {
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class CandidatesApi {
  private readonly http = inject(HttpClient);

  getCandidates(
    filter?: CandidatesFilter,
    sort?: CandidatesSort,
    pagination?: CandidatesPagination,
  ): Observable<CandidatesResponse<Candidate>> {
    return this.http.get<CandidatesResponse<CandidateDTO>>('/api/Candidate.json').pipe(
      map((res) => {
        let candidates: Candidate[] = res.records.map(mapDtoToCandidate);

        // Apply filtering
        if (filter) {
          candidates = this.applyFilter(candidates, filter);
        }

        // Apply sorting
        if (sort) {
          candidates = this.applySort(candidates, sort);
        }
        // Apply pagination
        if (pagination) {
          const start = pagination.page * pagination.pageSize;
          const end = start + pagination.pageSize;
          return {
            ...res,
            records: candidates.slice(start, end),
            totalRecords: candidates.length,
          };
        }

        return {
          ...res,
          records: candidates,
          totalRecords: candidates.length,
        };
      }),
    );
  }

  getCandidateById(id: string): Observable<Candidate | null> {
    return this.getCandidates().pipe(
      map((res) => {
        return res.records.find((candidate) => candidate.ConsIntID === id) || null;
      }),
    );
  }

  getCandidatePipelineDetails(
    candidateId: string,
    recruiter: string | null = null,
    startDate: Date | null = null,
    endDate: Date | null = null,
  ): Observable<PipelineStage[]> {
    return this.http.get<PipelineStageDTO[]>(`/api/CandidatePipeline.json`).pipe(
      map((res) =>
        res
          .filter((stageDto) => stageDto.ConsIntID === candidateId)
          .map(mapDtoToPipelineStage)
          .filter((stage) => {
            let fit = true;
            if (recruiter) {
              fit &&= stage.Contact === recruiter;
            }
            if (startDate) {
              fit &&= stage.DateAndTime >= startDate;
            }
            if (endDate) {
              fit &&= stage.DateAndTime <= endDate;
            }
            return fit;
          }),
      ),
    );
  }

  private applyFilter(candidates: Candidate[], filter: CandidatesFilter): Candidate[] {
    let result = candidates;

    // Availability filter
    if (filter.availability && filter.availability !== 'all') {
      if (filter.availability === 'available') {
        result = result.filter((c) => c.Available);
      } else if (filter.availability === 'unavailable') {
        result = result.filter((c) => !c.Available);
      }
    }

    // Status filter (case-insensitive)
    if (filter.status) {
      const status = filter.status.toLowerCase();
      result = result.filter((c) => c.Status?.toLowerCase() === status);
    }

    // Job title filter
    if (filter.jobTitle) {
      const jobTitle = filter.jobTitle.toLowerCase();
      result = result.filter((c) => c.JobTitle?.toLowerCase().includes(jobTitle));
    }

    // City filter
    if (filter.city) {
      const city = filter.city.toLowerCase();
      result = result.filter((c) => c.City?.toLowerCase().includes(city));
    }

    // State filter
    if (filter.state) {
      const state = filter.state.toLowerCase();
      result = result.filter((c) => c.State?.toLowerCase().includes(state));
    }

    // Skills filter
    if (filter.skills && filter.skills.length > 0) {
      const skillsLower = filter.skills.map((s) => s.toLowerCase());
      result = result.filter((c) =>
        c.PrimarySkills?.some((skill) => skillsLower.some((s) => skill.toLowerCase().includes(s))),
      );
    }

    // Primary skills (single text) filter
    if (filter.primarySkills) {
      const term = filter.primarySkills.toLowerCase().trim();
      result = result.filter((c) =>
        c.PrimarySkills?.some((skill) => skill.toLowerCase().includes(term)),
      );
    }

    // First name filter
    if (filter.firstName) {
      const firstName = filter.firstName.toLowerCase();
      result = result.filter((c) => c.FirstName?.toLowerCase().includes(firstName));
    }

    // Last name filter
    if (filter.lastName) {
      const lastName = filter.lastName.toLowerCase();
      result = result.filter((c) => c.LastName?.toLowerCase().includes(lastName));
    }

    // Mobile filter
    if (filter.mobile) {
      const mobile = filter.mobile.toLowerCase();
      result = result.filter((c) => c.MobilePhone?.toLowerCase().includes(mobile));
    }

    // Email filter
    if (filter.email) {
      const email = filter.email.toLowerCase();
      result = result.filter((c) => c.EMail1?.toLowerCase().includes(email));
    }

    return result;
  }

  private applySort(candidates: Candidate[], sort: CandidatesSort): Candidate[] {
    return [...candidates].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sort.order === 'asc' ? 1 : -1;
      if (bValue == null) return sort.order === 'asc' ? -1 : 1;

      let comparison: number;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sort.order === 'asc' ? comparison : -comparison;
    });
  }
}
