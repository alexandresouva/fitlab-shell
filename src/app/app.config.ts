import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MfeContextService } from './core/context/mfe-context.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const service = inject(MfeContextService);
        return () => service;
      },
      multi: true
    }
  ]
};
