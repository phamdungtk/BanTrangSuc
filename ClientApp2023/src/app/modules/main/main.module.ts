import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DanhMucComponent } from './danh-muc/danh-muc.component';
import { ChiTietComponent } from './chi-tiet/chi-tiet.component';
import { SanPhamComponent } from './san-pham/san-pham.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextContentTruncatePipe } from 'src/app/truncate.pipe';




@NgModule({
  declarations: [
    IndexComponent,
    DanhMucComponent,
    ChiTietComponent,
    SanPhamComponent,
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
      { path: 'danh-muc/:id', component: DanhMucComponent }
    ])
  ],
})
export class MainModule { }
