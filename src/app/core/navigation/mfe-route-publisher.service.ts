import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { filter } from 'rxjs/operators';

import { publishMfeEvent, SHELL_EVENTS } from '@fitlab/tooling';

@Injectable({
  providedIn: 'root'
})
export class MfeRoutePublisherService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        publishMfeEvent(SHELL_EVENTS.ROUTE_CHANGED, this.extractRouteData());
      });
  }

  private extractRouteData() {
    const params: Record<string, string> = {};
    let activeRoute = this.route.root;

    // Traverse the active route tree to dynamically collect path parameters
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
      Object.assign(params, activeRoute.snapshot.params);
    }

    return {
      path: this.router.url,
      params: Object.freeze(params),
      queryParams: Object.freeze(
        this.router.routerState.snapshot.root.queryParams
      )
    };
  }
}
