import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip if URL is already absolute (starts with http:// or https://)
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const reqClone = req.clone({
    url: environment.baseUrl + req.url,
  });
  return next(reqClone);
};
