import { Routes } from '@angular/router';

import { MfeErrorFallbackComponent } from './core/layout/mfe-error-fallback/mfe-error-fallback.component';
import { createMfeRoute } from './core/navigation/mfe-route.helper';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'home',
    redirectTo: ''
  },
  createMfeRoute({
    path: 'workouts',
    remoteName: 'mfe-workout-planner',
    exposedModule: './remote-routes',
    moduleName: 'Planejador de Treinos',
    fallbackComponent: MfeErrorFallbackComponent
  }),
  createMfeRoute({
    path: 'nutrition',
    remoteName: 'mfe-nutrition',
    exposedModule: './remote-routes',
    moduleName: 'Nutrição & Dietas',
    fallbackComponent: MfeErrorFallbackComponent
  }),
  createMfeRoute({
    path: 'timer',
    remoteName: 'mfe-interval-timer',
    exposedModule: './remote-routes',
    moduleName: 'Timer de Intervalos',
    fallbackComponent: MfeErrorFallbackComponent
  }),
  createMfeRoute({
    path: 'card-generator',
    remoteName: 'mfe-card-generator',
    exposedModule: './remote-routes',
    moduleName: 'Gerador de Fichas',
    fallbackComponent: MfeErrorFallbackComponent
  }),
  {
    path: '**',
    redirectTo: ''
  }
];
