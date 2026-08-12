import { TestBed } from '@angular/core/testing';

import { SHELL_EVENTS, listenMfeEvent } from '@fitlab/tooling';

import { MfeContextService } from './mfe-context.service';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../theme/theme.service';

describe('MfeContextService', () => {
  let service: MfeContextService;
  let authService: AuthService;
  let themeService: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    delete window.mfeContext;
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);
    themeService = TestBed.inject(ThemeService);
    service = TestBed.inject(MfeContextService);
  });

  afterEach(() => {
    localStorage.clear();
    delete window.mfeContext;
  });

  it('should be created and initialize window.mfeContext snapshot', () => {
    expect(service).toBeTruthy();
    expect(window.mfeContext).toBeDefined();
    expect(window.mfeContext?.user.name).toBe('Alexandre Souza');
    expect(window.mfeContext?.theme).toBe('light');
    expect(window.mfeContext?.workspaceId).toBe('default');
    expect(window.mfeContext?.locale).toBe('pt-BR');
  });

  it('should update window.mfeContext and dispatch THEME_CHANGED when theme changes', () => {
    let capturedTheme = '';
    const unlisten = listenMfeEvent(SHELL_EVENTS.THEME_CHANGED, (theme) => {
      capturedTheme = theme;
    });

    themeService.setTheme('dark');
    TestBed.flushEffects();

    expect(window.mfeContext?.theme).toBe('dark');
    expect(capturedTheme).toBe('dark');

    unlisten();
  });

  it('should not update or emit when window.mfeContext is deleted before theme effect flushes', () => {
    delete window.mfeContext;
    themeService.setTheme('dark');
    TestBed.flushEffects();
    expect(window.mfeContext).toBeUndefined();
  });

  it('should update window.mfeContext and dispatch USER_CHANGED when user changes', () => {
    let capturedUserName = '';
    const unlisten = listenMfeEvent(SHELL_EVENTS.USER_CHANGED, (user) => {
      capturedUserName = user.name;
    });

    authService.setUser({
      id: 'usr_02',
      name: 'Maria Treinadora',
      email: 'maria@fitlab.dev'
    });
    TestBed.flushEffects();

    expect(window.mfeContext?.user.name).toBe('Maria Treinadora');
    expect(capturedUserName).toBe('Maria Treinadora');

    unlisten();
  });

  it('should not update or emit when window.mfeContext is deleted before user effect flushes', () => {
    delete window.mfeContext;
    authService.setUser({
      id: 'usr_03',
      name: 'Carlos Personal',
      email: 'carlos@fitlab.dev'
    });
    TestBed.flushEffects();
    expect(window.mfeContext).toBeUndefined();
  });
});
