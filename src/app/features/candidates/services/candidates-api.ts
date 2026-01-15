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
}
