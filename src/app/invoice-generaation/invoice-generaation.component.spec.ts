import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceGeneraationComponent } from './invoice-generaation.component';

describe('InvoiceGeneraationComponent', () => {
  let component: InvoiceGeneraationComponent;
  let fixture: ComponentFixture<InvoiceGeneraationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceGeneraationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceGeneraationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
