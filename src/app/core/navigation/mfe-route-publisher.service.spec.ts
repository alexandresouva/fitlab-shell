import { TestBed } from '@angular/core/testing';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  Event as RouterEvent
} from '@angular/router';

import { Subject } from 'rxjs';

import { SHELL_EVENTS } from '@fitlab/tooling';

import { MfeRoutePublisherService } from './mfe-route-publisher.service';

describe('MfeRoutePublisherService', () => {
  let service: MfeRoutePublisherService;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let routerEvents$: Subject<RouterEvent>;
  let publishedEvents: CustomEvent[];

  beforeEach(() => {
    routerEvents$ = new Subject<RouterEvent>();
    mockRouter = {
      events: routerEvents$.asObservable(),
      url: '/workouts/edit/99',
      routerState: {
        snapshot: {
          root: {
            queryParams: { view: 'compact' }
          }
        }
      }
    } as unknown as Router;

    const mockChildRoute = {
      snapshot: { params: { id: '99' } },
      firstChild: null
    } as unknown as ActivatedRoute;

    mockActivatedRoute = {
      root: {
        firstChild: mockChildRoute
      }
    } as unknown as ActivatedRoute;

    publishedEvents = [];
    spyOn(window, 'dispatchEvent').and.callFake((event: Event) => {
      if (event instanceof CustomEvent) {
        publishedEvents.push(event);
      }
      return true;
    });

    TestBed.configureTestingModule({
      providers: [
        MfeRoutePublisherService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    service = TestBed.inject(MfeRoutePublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should publish ROUTE_CHANGED event on NavigationEnd', () => {
    routerEvents$.next(
      new NavigationEnd(1, '/workouts/edit/99', '/workouts/edit/99')
    );

    expect(window.dispatchEvent).toHaveBeenCalled();
    const event = publishedEvents.find(
      (e) => e.type === SHELL_EVENTS.ROUTE_CHANGED
    );
    expect(event).toBeTruthy();
    expect(event?.detail).toEqual({
      path: '/workouts/edit/99',
      params: { id: '99' },
      queryParams: { view: 'compact' }
    });
  });

  it('should not publish ROUTE_CHANGED on other router events', () => {
    routerEvents$.next({ id: 1, url: '/other' } as unknown as RouterEvent);
    const event = publishedEvents.find(
      (e) => e.type === SHELL_EVENTS.ROUTE_CHANGED
    );
    expect(event).toBeUndefined();
  });
});
