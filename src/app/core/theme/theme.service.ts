import { Injectable, effect, signal } from '@angular/core';

import { MfeTheme } from '@fitlab/tooling';

export type AppTheme = MfeTheme;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'fitlab-theme';
  readonly theme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const activeTheme = this.theme();
      this.applyThemeToDocument(activeTheme);
      this.saveThemeToStorage(activeTheme);
    });
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  setTheme(newTheme: AppTheme): void {
    this.theme.set(newTheme);
  }

  private getInitialTheme(): AppTheme {
    try {
      const savedTheme = localStorage.getItem(this.storageKey) as AppTheme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    } catch {
      // Fallback for environments without localStorage
    }
    return 'light';
  }

  private applyThemeToDocument(theme: AppTheme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }

  private saveThemeToStorage(theme: AppTheme): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch {
      // Ignore storage errors in test / sandbox
    }
  }
}
