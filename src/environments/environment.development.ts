export const environment = {
  production: false,
  baseUrl: 'https://exelareweb.com/ExelareWebApi/',
  shareJobsUrl: 'https://jobs.cbizsoft.com/sharejobs',
  candidateSourcingBaseUrl: 'https://jobs.cbizsoft.com/candidatesourcingapi/',
  smsBaseUrl: 'https://jobs.cbizsoft.com/exelarejobsapi/api/',
  twilioApiBaseUrl: 'http://localhost:5003',
  gapiClientId: '866388217479-4kg6lndhs4df49iqilqtms89ttmnoqi3.apps.googleusercontent.com',
  gapiRedirectUrl: 'https://exelare-angular-test.azurewebsites.net',
  urls: [
    'http://localhost:51061/',
    'https://exelareweb.com/ExelareWebApi/',
    'https://jobs.exelare.com/ExelareWebApi/',
  ],
  buildUrl: (url: string): string => {
    const cUrl = localStorage.getItem('WEB_SERVICES');
    return (cUrl ? cUrl : 'https://jobs.exelare.com/ExelareWebApi/') + url;
  },
  buildZoomUrl: (url: string): string => {
    const zoomBase = 'https://jobs.exelare.com/ExelareWebApi/api/zoom/';
    if (!environment.production) {
      const cleanUrl = url.replace(/^api\/zoom\//, '');
      return zoomBase + cleanUrl;
    }
    return environment.buildUrl(url);
  },
  buildCandidateSourcingUrl: (url: string): string => {
    return environment.candidateSourcingBaseUrl + url;
  },
  buildSmsUrl: (url: string): string => {
    return environment.smsBaseUrl + url;
  },
  buildTwilioUrl: (url: string): string => {
    return environment.buildUrl('') + 'api/twilio' + url;
  },
  azureSpeechKey:
    '8m6lbJgDjuONZi67IRK52Pmj8dJnBS8XzjFOr5JlhkCRV4LgHNftJQQJ99BAAC1i4TkXJ3w3AAAYACOGjnKh',
  azureRegion: 'centralus',
  GA_TRACKING_ID: 'G-73MJLMN9SR',
};
