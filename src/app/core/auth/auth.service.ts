import { Injectable, effect, signal } from '@angular/core';

import { MfeContext } from '@fitlab/tooling';

import { AuthUser } from './auth.models';

declare global {
  interface Window {
    mfeContext?: MfeContext;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly defaultUser: AuthUser = {
    id: 'usr_fitlab_01',
    name: 'Alexandre Souza',
    email: 'alexandre@fitlab.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alexandre'
  };

  readonly currentUser = signal<AuthUser>(this.defaultUser);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      this.syncWithMfeContext(user);
    });
  }

  setUser(user: AuthUser): void {
    this.currentUser.set(user);
  }

  private syncWithMfeContext(user: AuthUser): void {
    window.mfeContext = {
      token: '',
      permissions: [],
      workspaceId: 'default',
      locale: 'pt-BR',
      theme: 'light',
      ...(window.mfeContext ?? {}),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
}
