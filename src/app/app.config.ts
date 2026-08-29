import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MfeContextService } from './core/context/mfe-context.service';
import { MfeRoutePublisherService } from './core/navigation/mfe-route-publisher.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        // Init both services on startup, ensuring mfeContext and mfeRoutePublisher are available from the beginning
        inject(MfeContextService);
        inject(MfeRoutePublisherService);
        return () => Promise.resolve();
      },
      multi: true
    }
  ]
};
