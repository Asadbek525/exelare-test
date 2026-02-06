import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Method } from '../dto/items';

@Injectable({
  providedIn: 'root',
})
export class MiscService {
  private http = inject(HttpClient);

  customExecuteRequestObs(config: {
    method: Method;
    url: string;
    headers: HttpHeaders | Record<string, string | string[]> | undefined;
    wantRaw: boolean;
  }) {
    return this.http.request(config.method, config.url, {
      headers: config.headers,
      responseType: config.wantRaw ? 'text' : 'json',
    });
  }
}
