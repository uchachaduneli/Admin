import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePregenerationComponent } from './invoice-pregeneration.component';

describe('InvoiceGeneraationComponent', () => {
  let component: InvoicePregenerationComponent;
  let fixture: ComponentFixture<InvoicePregenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePregenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePregenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
