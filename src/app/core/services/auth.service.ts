import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthRequest, RestUserResponse } from '../dto/rest-user';
import { DateTimeHelper } from '../date-time-helper';
import { EntityHelper } from '../entity-helper';
import { IResult, UAParser } from 'ua-parser-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  public login(authData: AuthRequest): Observable<RestUserResponse> {
    let envData: IResult | undefined = undefined;
    try {
      envData = new UAParser().getResult();
    } catch (e) {
      console.error(e);
    }

    return this.http
      .post<RestUserResponse>(environment.buildUrl('api/login'), {
        ...authData,
        utcOffset: DateTimeHelper.getUtcOffsetInHours(),
        userEnvironment: envData,
        ignoreForeignEntities: true,
      })
      .pipe(
        map((usr) => {
          if (!usr.entities) {
            usr.entities = [];
          }
          usr.entities.push(
            {
              id: EntityHelper.OnBoarding,
              caption: 'OnBoarding',
              sid: '',
              scaption: '',
              properties: 0,
              views: [],
              tabs: [],
            },
            {
              id: EntityHelper.CandidateSourcing,
              caption: 'Candidate Sourcing',
              sid: '',
              scaption: '',
              properties: 0,
              views: [],
              tabs: [],
            },
            {
              id: 'RecycleBin',
              caption: 'Recycle Bin',
              sid: '',
              scaption: '',
              properties: 0,
              views: [],
              tabs: [],
            },
            {
              id: 'EmailCampaigns',
              caption: 'Outreach Campaigns',
              sid: '',
              scaption: '',
              properties: 0,
              views: [],
              tabs: [],
            },
          );

          return usr;
        }),
      );
  }
}
