import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivate } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: CanActivate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    authGuard = TestBed.inject(AuthGuard) as CanActivate;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
});