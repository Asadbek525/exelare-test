import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { GetPageRequest, GetPageResponse, RecordSet } from '../dto/get-page.dto';

@Injectable({
  providedIn: 'root',
})
export class GetService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  getPage<T>(request: GetPageRequest) {
    return this.http
      .post<GetPageResponse<T>>('/api/data/getPage', {
        ...request,
        pageNumber: request.pageNumber + 1,
      })
      .pipe(
        catchError(
          this.errorHandler.handleError(
            `Error while loading ${request.entityId} entities`,
            undefined,
          ),
        ),
      );
  }

  getItem<T>(id: string) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    let body = new HttpParams();
    body = body.set('', id);
    return this.http
      .post<RecordSet<T>>('/api/items/getItem', body, { headers: header })
      .pipe(
        catchError(
          this.errorHandler.handleError(`Error while loading item with ID ${id}`, undefined),
        ),
      );
  }
}
