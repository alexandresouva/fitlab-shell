import { Injectable, signal } from '@angular/core';

import { AuthUser } from './auth.models';

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

  setUser(user: AuthUser): void {
    this.currentUser.set(user);
  }
}
