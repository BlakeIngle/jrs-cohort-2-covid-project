import { TestBed } from '@angular/core/testing';

import { StateAuthGuard } from './state-auth.guard';

describe('StateAuthGuard', () => {
  let guard: StateAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StateAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
