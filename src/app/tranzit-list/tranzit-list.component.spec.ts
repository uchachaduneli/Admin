import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranzitListComponent } from './tranzit-list.component';

describe('TranzitListComponent', () => {
  let component: TranzitListComponent;
  let fixture: ComponentFixture<TranzitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranzitListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranzitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
