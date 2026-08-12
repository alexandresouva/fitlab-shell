import { TestBed } from '@angular/core/testing';

import { AuthUser } from './auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    delete window.mfeContext;
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    delete window.mfeContext;
  });

  it('should be created and have default authenticated user', () => {
    expect(service).toBeTruthy();
    expect(service.currentUser().name).toBe('Alexandre Souza');
  });

  it('should sync user to window.mfeContext on initialization and change', () => {
    TestBed.flushEffects();
    expect(window.mfeContext?.user?.name).toBe('Alexandre Souza');
    expect(window.mfeContext?.token).toBe('');
    expect(window.mfeContext?.workspaceId).toBe('default');

    const newUser: AuthUser = {
      id: 'usr_02',
      name: 'Maria Treinadora',
      email: 'maria@fitlab.dev'
    };

    service.setUser(newUser);
    TestBed.flushEffects();

    expect(service.currentUser().name).toBe('Maria Treinadora');
    expect(window.mfeContext?.user?.name).toBe('Maria Treinadora');
  });
});
