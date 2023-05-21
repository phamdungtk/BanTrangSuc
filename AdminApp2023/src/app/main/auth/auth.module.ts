import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguoiDungComponent } from './nguoi-dung/nguoi-dung.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SanPhamComponent } from './san-pham/san-pham.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DanhMucComponent } from './danh-muc/danh-muc.component';
import { NhaSanXuatComponent } from './nha-san-xuat/nha-san-xuat.component';
import { DonViTinhComponent } from './don-vi-tinh/don-vi-tinh.component';
import { CtAnhSanPhamComponent } from './ct-anh-san-pham/ct-anh-san-pham.component';
import { HoaDonNhapComponent } from './hoa-don-nhap/hoa-don-nhap.component';
import { NhomSanPhamComponent } from './nhom-san-pham/nhom-san-pham.component';
import { ChiTietNhomComponent } from './chi-tiet-nhom/chi-tiet-nhom.component';
import { DonHangComponent } from './don-hang/don-hang.component';
import { NhaCungCapComponent } from './nha-cung-cap/nha-cung-cap.component';
import { CtDonHangComponent } from './ct-don-hang/ct-don-hang.component';
import { PhanHoiComponent } from './phan-hoi/phan-hoi.component';
import { TinTucComponent } from './tin-tuc/tin-tuc.component';
@NgModule({
  declarations: [
    NguoiDungComponent,
    SanPhamComponent,
    DanhMucComponent,
    NhaSanXuatComponent,
    DonViTinhComponent,
    CtAnhSanPhamComponent,
    HoaDonNhapComponent,
    NhomSanPhamComponent,
    ChiTietNhomComponent,
    DonHangComponent,
    NhaCungCapComponent,
    CtDonHangComponent,
    PhanHoiComponent,
    TinTucComponent
  ],
  imports: [
    ReactiveFormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    CKEditorModule,
    RouterModule.forChild([
      {
        path: 'nguoi-dung',
        component: NguoiDungComponent,
      },
      {
        path: 'san-pham',
        component: SanPhamComponent,
      },
      {
        path: 'danh-muc',
        component: DanhMucComponent,
      },
      {
        path: 'nha-san-xuat',
        component: NhaSanXuatComponent,
      },
      {
        path: 'don-vi-tinh',
        component: DonViTinhComponent,
      },
      {
        path: 'hoa-don-nhap',
        component: HoaDonNhapComponent,
      },
      { path: 'chi-tiet-anh/:id', component: CtAnhSanPhamComponent },
      { path: 'phan-hoi/:id', component: PhanHoiComponent },
      {
        path: 'nhom-san-pham',
        component: NhomSanPhamComponent,
      },
      { path: 'chi-tiet-nhom/:id', component: ChiTietNhomComponent },
      {
        path: 'don-hang',
        component: DonHangComponent,
      },
      { path: 'chi-don-hang/:id', component: CtDonHangComponent },
      {
        path: 'nha-cung-cap',
        component: NhaCungCapComponent,
      },
      {
        path: 'tin-tuc',
        component: TinTucComponent,
      },
  ]),  
  ]
})
export class AuthModule { }
