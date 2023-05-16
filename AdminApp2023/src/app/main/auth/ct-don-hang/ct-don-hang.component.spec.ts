import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtDonHangComponent } from './ct-don-hang.component';

describe('CtDonHangComponent', () => {
  let component: CtDonHangComponent;
  let fixture: ComponentFixture<CtDonHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtDonHangComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtDonHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
