import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DoctypesComponent} from './doctypes.component';

describe('DoctypesComponent', () => {
  let component: DoctypesComponent;
  let fixture: ComponentFixture<DoctypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctypesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
