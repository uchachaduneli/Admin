import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffDetailsComponent } from './tariff-details.component';

describe('TariffDetailsComponent', () => {
  let component: TariffDetailsComponent;
  let fixture: ComponentFixture<TariffDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TariffDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
