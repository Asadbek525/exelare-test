import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  // Inject the service once at the class level
  private messageService = inject(MessageService);

  /**
   * Returns a function to be used inside catchError
   */
  handleError<T>(summary: string, result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(error); // Always log for debugging

      if (error instanceof HttpErrorResponse) {
        this.messageService.add({
          severity: 'error',
          summary: summary,
          detail: error.message || 'Server Error',
        });
      } else if (error instanceof Error) {
        this.messageService.add({
          severity: 'error',
          summary: summary,
          detail: error.message,
        });
      }

      // Return the fallback value as an observable
      return of(result as T);
    };
  }
}
