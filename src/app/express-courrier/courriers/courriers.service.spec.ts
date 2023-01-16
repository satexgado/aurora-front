import { TestBed } from '@angular/core/testing';

import { CourriersService } from './courriers.service';

describe('CourriersService', () => {
  let service: CourriersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourriersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
