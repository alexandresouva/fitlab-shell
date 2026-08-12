import { TestBed } from '@angular/core/testing';

import { AuthUser } from './auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created and have default user', () => {
    expect(service).toBeTruthy();
    expect(service.currentUser().name).toBe('Alexandre Souza');
    expect(service.currentUser().email).toBe('alexandre@fitlab.dev');
  });

  it('should update current user when setUser is called', () => {
    const newUser: AuthUser = {
      id: 'usr_02',
      name: 'Maria Treinadora',
      email: 'maria@fitlab.dev'
    };

    service.setUser(newUser);
    expect(service.currentUser().name).toBe('Maria Treinadora');
    expect(service.currentUser().id).toBe('usr_02');
  });
});
