import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhomSanPhamComponent } from './nhom-san-pham.component';

describe('NhomSanPhamComponent', () => {
  let component: NhomSanPhamComponent;
  let fixture: ComponentFixture<NhomSanPhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhomSanPhamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhomSanPhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
