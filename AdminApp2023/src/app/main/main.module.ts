import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MainRoutes } from './main.route';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ MainComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(MainRoutes)
  ]
})
export class MainModule { }
