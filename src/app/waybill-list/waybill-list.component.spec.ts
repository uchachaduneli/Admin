import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillListComponent } from './waybill-list.component';

describe('WaybillListComponent', () => {
  let component: WaybillListComponent;
  let fixture: ComponentFixture<WaybillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaybillListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
