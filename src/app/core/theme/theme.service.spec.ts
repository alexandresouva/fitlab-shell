import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
  });

  it('should be created and initialize default theme', () => {
    expect(service).toBeTruthy();
    expect(service.theme()).toBeDefined();
  });

  it('should toggle theme from light to dark and vice versa', () => {
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should apply dark class and data-theme to documentElement when toggled to dark', () => {
    service.toggleTheme();
    TestBed.flushEffects();

    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('fitlab-theme')).toBe('dark');
  });

  it('should remove dark class from documentElement when toggled back to light', () => {
    service.toggleTheme();
    TestBed.flushEffects();
    service.toggleTheme();
    TestBed.flushEffects();

    expect(document.documentElement.classList.contains('dark')).toBeFalse();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('fitlab-theme')).toBe('light');
  });

  it('should read saved theme from localStorage on initialization', () => {
    localStorage.setItem('fitlab-theme', 'dark');
    TestBed.resetTestingModule();
    const newService = TestBed.inject(ThemeService);
    expect(newService.theme()).toBe('dark');
  });

  it('should initialize dark theme when prefers-color-scheme matches dark and no saved theme', () => {
    spyOn(window, 'matchMedia').and.callFake((query: string) => {
      return {
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      } as MediaQueryList;
    });

    TestBed.resetTestingModule();
    const darkService = TestBed.inject(ThemeService);
    expect(darkService.theme()).toBe('dark');
  });

  it('should sync theme to window.mfeContext when mfeContext exists', () => {
    window.mfeContext = {
      token: '',
      permissions: [],
      workspaceId: 'default',
      locale: 'pt-BR',
      theme: 'light',
      user: { id: '', name: '', email: '' }
    };

    service.toggleTheme();
    TestBed.flushEffects();

    expect(window.mfeContext.theme).toBe('dark');
  });

  it('should handle localStorage.getItem error gracefully and fallback to default theme', () => {
    spyOn(localStorage, 'getItem').and.throwError('Storage error');
    TestBed.resetTestingModule();
    const fallbackService = TestBed.inject(ThemeService);
    expect(fallbackService.theme()).toBe('light');
  });

  it('should handle localStorage.setItem error gracefully', () => {
    spyOn(localStorage, 'setItem').and.throwError('Quota exceeded');
    spyOn(console, 'error');
    service.toggleTheme();
    TestBed.flushEffects();
    expect(console.error).toHaveBeenCalled();
  });
});
