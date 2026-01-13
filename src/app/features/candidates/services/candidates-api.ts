import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidate, CandidateDTO, CandidatesResponse } from '../models/candidate.model';
import { map, Observable } from 'rxjs';
import { mapDtoToCandidate } from '../mappers/candidate.mapper';

@Injectable({
  providedIn: 'root',
})
export class CandidatesApi {
  private readonly http = inject(HttpClient);

  getCandidates(): Observable<CandidatesResponse<Candidate>> {
    return this.http.get<CandidatesResponse<CandidateDTO>>('/api/Candidate.json').pipe(
      map((res) => {
        const candidates: Candidate[] = res.records.map(mapDtoToCandidate);
        return {
          ...res,
          records: candidates,
        };
      }),
    );
  }

  getCandidateById(id: string) {
    return this.getCandidates().pipe(
      map((res) => {
        return res.records.find((candidate) => candidate.ConsIntID === id) || null;
      }),
    );
  }
}
