import { TestBed } from '@angular/core/testing';
import { CanActivate } from '@angular/router';

import { LoggedInGuard } from './logged-in.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoggedInGuard', () => {
  let loggedInGuard: CanActivate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LoggedInGuard]
    });

    loggedInGuard = TestBed.inject(LoggedInGuard) as CanActivate;
  });

  it('should be created', () => {
    expect(loggedInGuard).toBeTruthy();
  });
});
