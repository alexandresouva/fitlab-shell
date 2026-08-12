import { Injectable, effect, inject } from '@angular/core';

import { MfeContext, SHELL_EVENTS, publishMfeEvent } from '@fitlab/tooling';

import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../theme/theme.service';

declare global {
  interface Window {
    mfeContext?: MfeContext;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MfeContextService {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.initSnapshot();
    this.bindDomainReactivity();
  }

  private initSnapshot(): void {
    const user = this.authService.currentUser();
    const theme = this.themeService.theme();

    window.mfeContext = {
      token: '',
      permissions: [],
      workspaceId: 'default',
      locale: 'pt-BR',
      ...(window.mfeContext ?? {}),
      theme,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  private bindDomainReactivity(): void {
    effect(() => {
      const theme = this.themeService.theme();
      if (!window.mfeContext) return;
      if (window.mfeContext.theme !== theme) {
        window.mfeContext = {
          ...window.mfeContext,
          theme
        };
        publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, theme);
      }
    });

    effect(() => {
      const user = this.authService.currentUser();
      if (!window.mfeContext) return;
      if (
        window.mfeContext.user.id !== user.id ||
        window.mfeContext.user.name !== user.name ||
        window.mfeContext.user.email !== user.email
      ) {
        const formattedUser = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        window.mfeContext = {
          ...window.mfeContext,
          user: formattedUser
        };
        publishMfeEvent(SHELL_EVENTS.USER_CHANGED, formattedUser);
      }
    });
  }
}
