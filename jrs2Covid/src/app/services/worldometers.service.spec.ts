import { TestBed } from '@angular/core/testing';

import { WorldometersService } from './worldometers.service';

describe('WorldometersService', () => {
  let service: WorldometersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldometersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
