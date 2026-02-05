import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, forkJoin } from 'rxjs';
import {
  Candidate,
  CandidateDTO,
  CandidatesResponse,
  PipelineStageDTO,
} from '../../features/candidates/models/candidate.model';
import { mapDtoToCandidate } from '../../features/candidates/mappers/candidate.mapper';

export type SearchResultType = 'candidate' | 'job' | 'contact' | 'company';

export interface SearchResult {
  id: string;
  label: string;
  type: SearchResultType;
  icon: string;
  subtitle?: string;
  route?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private readonly http = inject(HttpClient);

  /**
   * Search across candidates and pipeline data
   */
  search(query: string): Observable<SearchResult[]> {
    if (!query || query.length < 2) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    const queryLower = query.toLowerCase();

    return forkJoin({
      candidates: this.http.get<CandidatesResponse<CandidateDTO>>('/api/Candidate.json'),
      pipeline: this.http.get<PipelineStageDTO[]>('/api/CandidatePipeline.json'),
    }).pipe(
      map(({ candidates, pipeline }) => {
        const results: SearchResult[] = [];

        // Search candidates
        const candidateResults = candidates.records
          .map(mapDtoToCandidate)
          .filter((c) => this.matchesCandidate(c, queryLower))
          .slice(0, 5)
          .map((c) => this.candidateToSearchResult(c));

        results.push(...candidateResults);

        // Search jobs from pipeline (unique job titles)
        const jobTitles = new Map<string, PipelineStageDTO>();
        pipeline.forEach((p) => {
          if (
            p.JobTitle?.toLowerCase().includes(queryLower) ||
            p.ReqIntID?.toLowerCase().includes(queryLower)
          ) {
            if (!jobTitles.has(p.ReqIntID)) {
              jobTitles.set(p.ReqIntID, p);
            }
          }
        });

        const jobResults = Array.from(jobTitles.values())
          .slice(0, 3)
          .map((p) => this.pipelineToJobSearchResult(p));

        results.push(...jobResults);

        // Search companies from pipeline (unique companies)
        const companies = new Map<string, PipelineStageDTO>();
        pipeline.forEach((p) => {
          if (p.Company?.toLowerCase().includes(queryLower)) {
            if (!companies.has(p.Company)) {
              companies.set(p.Company, p);
            }
          }
        });

        const companyResults = Array.from(companies.values())
          .slice(0, 3)
          .map((p) => this.pipelineToCompanySearchResult(p));

        results.push(...companyResults);

        // Search contacts from pipeline
        const contacts = new Map<string, PipelineStageDTO>();
        pipeline.forEach((p) => {
          if (p.Contact?.toLowerCase().includes(queryLower)) {
            if (!contacts.has(p.Contact)) {
              contacts.set(p.Contact, p);
            }
          }
        });

        const contactResults = Array.from(contacts.values())
          .slice(0, 3)
          .map((p) => this.pipelineToContactSearchResult(p));

        results.push(...contactResults);

        return results.slice(0, 10); // Limit total results
      }),
    );
  }

  private matchesCandidate(candidate: Candidate, query: string): boolean {
    return !!(
      candidate.FirstName?.toLowerCase().includes(query) ||
      candidate.LastName?.toLowerCase().includes(query) ||
      candidate.FullName?.toLowerCase().includes(query) ||
      candidate.JobTitle?.toLowerCase().includes(query) ||
      candidate.EMail1?.toLowerCase().includes(query) ||
      candidate.MobilePhone?.includes(query) ||
      candidate.PrimarySkills?.some((s) => s.toLowerCase().includes(query))
    );
  }

  private candidateToSearchResult(candidate: Candidate): SearchResult {
    return {
      id: candidate.ConsIntID,
      label: candidate.FullName || `${candidate.FirstName} ${candidate.LastName}`,
      type: 'candidate',
      icon: 'pi pi-user',
      subtitle: candidate.JobTitle || candidate.PrimarySkills?.slice(0, 2).join(', '),
      route: `/candidates/${candidate.ConsIntID}`,
    };
  }

  private pipelineToJobSearchResult(pipeline: PipelineStageDTO): SearchResult {
    return {
      id: pipeline.ReqIntID,
      label: pipeline.JobTitle || 'Unknown Job',
      type: 'job',
      icon: 'pi pi-briefcase',
      subtitle: pipeline.Company,
      route: `/jobs/${pipeline.ReqIntID}`,
    };
  }

  private pipelineToCompanySearchResult(pipeline: PipelineStageDTO): SearchResult {
    return {
      id: pipeline.Company?.replace(/\s/g, '-').toLowerCase() || 'unknown',
      label: pipeline.Company || 'Unknown Company',
      type: 'company',
      icon: 'pi pi-building',
      subtitle: pipeline.JobTitle,
      route: `/companies`,
    };
  }

  private pipelineToContactSearchResult(pipeline: PipelineStageDTO): SearchResult {
    return {
      id: pipeline.Contact?.replace(/\s/g, '-').toLowerCase() || 'unknown',
      label: pipeline.Contact || 'Unknown Contact',
      type: 'contact',
      icon: 'pi pi-id-card',
      subtitle: pipeline.Company,
      route: `/contacts`,
    };
  }
}
