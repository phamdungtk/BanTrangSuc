import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesComponent } from './modules.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ModulesRoutingModule } from './modules-routing.module';
import { TextContentTruncatePipe } from '../truncate.pipe';



@NgModule({
  declarations: [
    ModulesComponent,
    // TextContentTruncatePipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ModulesRoutingModule)
  ]
})
export class ModulesModule { }
