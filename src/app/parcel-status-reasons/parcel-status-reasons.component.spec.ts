import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelStatusReasonsComponent } from './parcel-status-reasons.component';

describe('ParcelStatusReasonsComponent', () => {
  let component: ParcelStatusReasonsComponent;
  let fixture: ComponentFixture<ParcelStatusReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelStatusReasonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelStatusReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
