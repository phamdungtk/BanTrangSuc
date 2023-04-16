import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtAnhSanPhamComponent } from './ct-anh-san-pham.component';

describe('CtAnhSanPhamComponent', () => {
  let component: CtAnhSanPhamComponent;
  let fixture: ComponentFixture<CtAnhSanPhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtAnhSanPhamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtAnhSanPhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
