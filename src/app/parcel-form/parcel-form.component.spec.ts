import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelFormComponent } from './parcel-form.component';

describe('ParcelFormComponent', () => {
  let component: ParcelFormComponent;
  let fixture: ComponentFixture<ParcelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
