import {TestBed} from '@angular/core/testing';

import {ParcelStatusService} from './parcel-status.service';

describe('ParcelStatusService', () => {
  let service: ParcelStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcelStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
