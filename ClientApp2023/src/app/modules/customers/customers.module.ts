import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent,

  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,NgbModule,
    RouterModule.forChild([
      { path: 'cart', component: CartComponent },
      { path: 'check-out', component: CheckoutComponent }
    ])
  ]
})
export class CustomersModule { }
