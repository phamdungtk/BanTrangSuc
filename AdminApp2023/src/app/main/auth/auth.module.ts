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


@NgModule({
  declarations: [
    NguoiDungComponent,
    SanPhamComponent,
    DanhMucComponent
  ],
  imports: [
    ReactiveFormsModule,
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
  ]),  
  ]
})
export class AuthModule { }
