import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
// import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { AddJwtInterceptor } from './interceptors/jwt.add';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';
import { customPreset } from './themePreset';
import { jwtDecode } from 'jwt-decode';
import { AddJwtInterceptor } from './interceptors/jwt.add';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        BaseUrlInterceptor,
        AddJwtInterceptor,
        loggingInterceptor,
      ])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: customPreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
