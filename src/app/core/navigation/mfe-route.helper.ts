import { Type } from '@angular/core';
import { Route, Routes } from '@angular/router';

import { loadRemoteModule } from '@softarc/native-federation-runtime';

export interface MfeRouteConfig {
  path: string;
  remoteName: string;
  exposedModule: string;
  moduleName: string;
  fallbackComponent: Type<unknown>;
  moduleLoader?: (
    remoteName: string,
    exposedModule: string
  ) => Promise<Record<string, unknown>>;
}

export function createMfeRoute(config: MfeRouteConfig): Route {
  const loader = config.moduleLoader ?? loadRemoteModule;

  return {
    path: config.path,
    loadChildren: () =>
      loader(config.remoteName, config.exposedModule)
        .then((m: Record<string, unknown>) => {
          const routes = (m['routes'] ?? m['default'] ?? m) as Routes;
          return routes;
        })
        .catch((err: unknown) => {
          console.error(
            `[MFE Router] Failed to load remote module "${config.remoteName}":`,
            err
          );
          return [
            {
              path: '',
              component: config.fallbackComponent,
              data: {
                moduleName: config.moduleName,
                moduleKey: config.remoteName
              }
            }
          ];
        })
  };
}
