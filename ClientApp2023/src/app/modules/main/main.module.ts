import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DanhMucComponent } from './danh-muc/danh-muc.component';
import { ChiTietComponent } from './chi-tiet/chi-tiet.component';
import { SanPhamComponent } from './san-pham/san-pham.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NhomSanPhamComponent } from './nhom-san-pham/nhom-san-pham.component';
import { GioiThieuComponent } from './gioi-thieu/gioi-thieu.component';
import { TintucComponent } from './tintuc/tintuc.component';
import { CtTintucComponent } from './ct-tintuc/ct-tintuc.component';
import { EmailComponent } from './customers/email/email.component';

@NgModule({
  declarations: [
    IndexComponent,
    DanhMucComponent,
    ChiTietComponent,
    SanPhamComponent,
    NhomSanPhamComponent,
    GioiThieuComponent,
    TintucComponent,
    CtTintucComponent,
    EmailComponent,
    // CKEditorModule,
    // TextContentTruncatePipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule, 
    RouterModule.forChild([
      { path: 'chi-tiet/:id', component: ChiTietComponent },
      { path: 'index', component: IndexComponent },
      { path: 'san-pham', component: SanPhamComponent },
      { path: 'tin-tuc', component: TintucComponent },
      { path: 'chi-tiet-tin-tuc/:id', component: CtTintucComponent },
      { path: 'gioi-thieu', component: GioiThieuComponent },
      { path: 'danh-muc/:id', component: DanhMucComponent },
      { path: 'nhom-san-pham/:id', component: NhomSanPhamComponent},
    ])
  ],
})
export class MainModule { }
