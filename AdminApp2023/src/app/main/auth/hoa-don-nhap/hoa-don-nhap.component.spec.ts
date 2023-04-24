import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoaDonNhapComponent } from './hoa-don-nhap.component';

describe('HoaDonNhapComponent', () => {
  let component: HoaDonNhapComponent;
  let fixture: ComponentFixture<HoaDonNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoaDonNhapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoaDonNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
