import { TestBed } from '@angular/core/testing';

import { ContactAddressService } from './contact-address.service';

describe('ContactAddressService', () => {
  let service: ContactAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
