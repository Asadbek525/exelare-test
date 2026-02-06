import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { throwError, EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const AUTH_HEADER_NAME = 'CBSAUTH_HTTP_HEADER';

  // Allow open endpoints
  if (
    req.url.endsWith('login') ||
    req.url.includes('api.groq.com') ||
    req.url.includes('ag-grid.com') ||
    req.url.includes('assets/')
  ) {
    return next(req);
  }

  const user = authStore.getUser();
  if (!user) {
    // If not logged in and trying to access protected resource, mostly return EMPTY or throw error?
    // Legacy returned EMPTY if not login and no user.
    return EMPTY as Observable<HttpEvent<unknown>>;
  }

  const modifiedReq = req.clone({
    headers: req.headers.set(AUTH_HEADER_NAME, user.request.authToken),
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 ||
        (error.status === 403 && error.error?.code?.toString() === '99999')
      ) {
        // Session timeout or unauthorized
        authStore.setUser(undefined);
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
