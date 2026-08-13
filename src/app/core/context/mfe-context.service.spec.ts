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

  it('should be created and initialize window.mfeContext snapshot with full user and theme', () => {
    expect(service).toBeTruthy();
    expect(window.mfeContext).toBeDefined();
    expect(window.mfeContext?.user.name).toBe('Alexandre Souza');
    expect(window.mfeContext?.user.avatarUrl).toBe(
      'https://api.dicebear.com/7.x/bottts/svg?seed=Alexandre'
    );
    expect(window.mfeContext?.theme).toBe('light');
    expect(window.mfeContext?.workspaceId).toBe('default');
    expect(window.mfeContext?.locale).toBe('pt-BR');
  });

  it('should update window.mfeContext and dispatch THEME_CHANGED when theme changes', () => {
    let callCount = 0;
    let capturedTheme = '';
    const unlisten = listenMfeEvent(SHELL_EVENTS.THEME_CHANGED, (theme) => {
      callCount++;
      capturedTheme = theme;
    });

    themeService.setTheme('dark');
    TestBed.flushEffects();

    expect(window.mfeContext?.theme).toBe('dark');
    expect(capturedTheme).toBe('dark');
    expect(callCount).toBe(1);

    // Setting same theme is ignored because window.mfeContext.theme === theme
    themeService.setTheme('dark');
    TestBed.flushEffects();
    expect(callCount).toBe(1);

    unlisten();
  });

  it('should not update or emit when window.mfeContext is deleted before theme effect flushes', () => {
    delete window.mfeContext;
    themeService.setTheme('dark');
    TestBed.flushEffects();
    expect(window.mfeContext).toBeUndefined();
  });

  it('should update window.mfeContext and dispatch USER_CHANGED when user changes', () => {
    let callCount = 0;
    let capturedUserName = '';
    const unlisten = listenMfeEvent(SHELL_EVENTS.USER_CHANGED, (user) => {
      callCount++;
      capturedUserName = user.name;
    });

    const newUser = {
      id: 'usr_02',
      name: 'Maria Treinadora',
      email: 'maria@fitlab.dev',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maria'
    };

    authService.setUser(newUser);
    TestBed.flushEffects();

    expect(window.mfeContext?.user.name).toBe('Maria Treinadora');
    expect(window.mfeContext?.user.avatarUrl).toBe(newUser.avatarUrl);
    expect(capturedUserName).toBe('Maria Treinadora');
    expect(callCount).toBe(1);

    // Setting user with same id is ignored because window.mfeContext.user.id === user.id
    authService.setUser({ ...newUser });
    TestBed.flushEffects();
    expect(callCount).toBe(1);

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
