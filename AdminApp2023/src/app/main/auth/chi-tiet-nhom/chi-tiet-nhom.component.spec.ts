import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNhomComponent } from './chi-tiet-nhom.component';

describe('ChiTietNhomComponent', () => {
  let component: ChiTietNhomComponent;
  let fixture: ComponentFixture<ChiTietNhomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNhomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiTietNhomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
