import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelStatusListComponent } from './parcel-status-list.component';

describe('ParcelStatusListComponent', () => {
  let component: ParcelStatusListComponent;
  let fixture: ComponentFixture<ParcelStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelStatusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
