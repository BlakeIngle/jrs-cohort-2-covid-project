import { TestBed } from '@angular/core/testing';

import { StateNamesService } from './state-names.service';

describe('StateNamesService', () => {
  let service: StateNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
