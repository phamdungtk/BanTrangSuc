import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'cart', component: CartComponent },
      { path: 'check-out', component: CheckoutComponent }
    ])
  ]
})
export class CustomersModule { }
