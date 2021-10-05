import { TestBed } from '@angular/core/testing';

import { JohnsHopkinsService } from './johns-hopkins.service';

describe('JohnsHopkinsService', () => {
  let service: JohnsHopkinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JohnsHopkinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
