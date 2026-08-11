import { Component } from '@angular/core';
import { Route, Routes } from '@angular/router';

import { createMfeRoute, MfeRouteConfig } from './mfe-route.helper';

@Component({
  standalone: true,
  template: '<div>Dummy Fallback</div>'
})
class MockFallbackComponent {}

describe('createMfeRoute', () => {
  const baseConfig: MfeRouteConfig = {
    path: 'test-path',
    remoteName: 'test-remote',
    exposedModule: './routes',
    moduleName: 'Módulo de Teste',
    fallbackComponent: MockFallbackComponent
  };

  it('should create a Route object with correct path and loadChildren function', () => {
    const route = createMfeRoute(baseConfig);
    expect(route.path).toBe('test-path');
    expect(typeof route.loadChildren).toBe('function');
  });

  it('should resolve routes when moduleLoader succeeds with "routes" export', async () => {
    const mockRoutes: Routes = [{ path: 'child', children: [] }];
    const mockLoader = jasmine
      .createSpy('moduleLoader')
      .and.returnValue(Promise.resolve({ routes: mockRoutes }));

    const route = createMfeRoute({
      ...baseConfig,
      moduleLoader: mockLoader
    });

    const loaded = await (route.loadChildren as () => Promise<Routes>)();
    expect(loaded).toBe(mockRoutes);
    expect(mockLoader).toHaveBeenCalledWith('test-remote', './routes');
  });

  it('should resolve routes when moduleLoader succeeds with default export', async () => {
    const mockRoutes: Routes = [{ path: 'default-child', children: [] }];
    const mockLoader = jasmine
      .createSpy('moduleLoader')
      .and.returnValue(Promise.resolve({ default: mockRoutes }));

    const route = createMfeRoute({
      ...baseConfig,
      moduleLoader: mockLoader
    });

    const loaded = await (route.loadChildren as () => Promise<Routes>)();
    expect(loaded).toBe(mockRoutes);
  });

  it('should resolve routes when moduleLoader succeeds with direct routes array', async () => {
    const mockRoutes: Routes = [{ path: 'direct-child', children: [] }];
    const mockLoader = jasmine
      .createSpy('moduleLoader')
      .and.returnValue(
        Promise.resolve(mockRoutes as unknown as Record<string, unknown>)
      );

    const route = createMfeRoute({
      ...baseConfig,
      moduleLoader: mockLoader
    });

    const loaded = await (route.loadChildren as () => Promise<Routes>)();
    expect(loaded).toBe(mockRoutes);
  });

  it('should return fallback route when moduleLoader fails', async () => {
    const mockLoader = jasmine
      .createSpy('moduleLoader')
      .and.returnValue(Promise.reject(new Error('Network error')));

    const route = createMfeRoute({
      ...baseConfig,
      moduleLoader: mockLoader
    });

    const loaded = (await (
      route.loadChildren as () => Promise<Route[]>
    )()) as Route[];

    expect(loaded).toHaveSize(1);
    expect(loaded[0].path).toBe('');
    expect(loaded[0].component).toBe(MockFallbackComponent);
    expect(loaded[0].data).toEqual({
      moduleName: 'Módulo de Teste',
      moduleKey: 'test-remote'
    });
  });

  it('should use default loadRemoteModule when moduleLoader is not provided', async () => {
    const route = createMfeRoute(baseConfig);
    const loaded = (await (
      route.loadChildren as () => Promise<Route[]>
    )()) as Route[];

    // In unit test environment, remote doesn't exist so it triggers the catch block
    expect(loaded).toHaveSize(1);
    expect(loaded[0].component).toBe(MockFallbackComponent);
  });
});
