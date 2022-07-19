import { TestBed } from '@angular/core/testing';

import { WaybillService } from './waybill.service';

describe('WaybillService', () => {
  let service: WaybillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaybillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
