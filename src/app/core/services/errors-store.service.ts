import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorsStoreService {
  // Placeholder for legacy compatibility
  setLoginErrors(url: string, errors: unknown[]): void {
    console.error('Login Errors:', errors);
  }
}
