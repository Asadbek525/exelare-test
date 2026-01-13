import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { Mock } from 'vitest';

import { baseUrlInterceptor } from './base-url-interceptor';
import { environment } from '../../environments/environment';

describe('baseUrlInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => baseUrlInterceptor(req, next));

  let nextHandler: Mock<HttpHandlerFn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    nextHandler = vi.fn(() => {
      return of({} as HttpEvent<unknown>);
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should prepend base URL to the request URL', () => {
    const request = new HttpRequest('GET', '/api/candidates');

    interceptor(request, nextHandler);

    expect(nextHandler).toHaveBeenCalled();
    const modifiedRequest = nextHandler.mock.calls[0][0] as HttpRequest<unknown>;
    expect(modifiedRequest.url).toBe(environment.baseUrl + '/api/candidates');
  });

  it('should prepend base URL to POST requests', () => {
    const request = new HttpRequest('POST', '/api/candidates', { name: 'Test' });

    interceptor(request, nextHandler);

    const modifiedRequest = nextHandler.mock.calls[0][0] as HttpRequest<unknown>;
    expect(modifiedRequest.url).toBe(environment.baseUrl + '/api/candidates');
    expect(modifiedRequest.method).toBe('POST');
  });
});
