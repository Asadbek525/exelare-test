import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './core/interceptors/base-url-interceptor';
import { MyPreset } from './core/presets/my-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
      overlayAppendTo: 'body',
    }),
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    MessageService,
  ],
};
