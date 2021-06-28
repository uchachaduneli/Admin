import { TestBed } from '@angular/core/testing';

import { TranzitService } from './tranzit.service';

describe('TranzitService', () => {
  let service: TranzitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranzitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
