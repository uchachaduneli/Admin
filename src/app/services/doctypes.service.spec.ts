import { TestBed } from '@angular/core/testing';

import { DoctypesService } from './doctypes.service';

describe('DoctypesService', () => {
  let service: DoctypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
