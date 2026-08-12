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
      this.syncWithMfeContext(activeTheme);
    });
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): AppTheme {
    const defaultTheme: AppTheme = 'light';

    try {
      const savedTheme = localStorage.getItem(this.storageKey) as AppTheme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }

      if (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) {
        return 'dark';
      }
    } catch {
      return defaultTheme;
    }
    return defaultTheme;
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
    } catch (error) {
      console.error(
        `[ThemeService] Não foi possível salvar o tema no localStorage:`,
        error
      );
    }
  }

  private syncWithMfeContext(theme: AppTheme): void {
    if (!window.mfeContext) return;

    window.mfeContext = {
      ...window.mfeContext,
      theme
    };
  }
}
