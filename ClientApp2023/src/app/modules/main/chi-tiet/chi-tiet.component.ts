import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-chi-tiet',
  templateUrl: './chi-tiet.component.html',
  styleUrls: ['./chi-tiet.component.css']
})
export class ChiTietComponent extends BaseComponent implements OnInit,AfterViewInit {
  public list_item:any;
  public item:any;
  constructor(injector: Injector, private _cart: CartService, private _send: SendService) {
    super(injector);
  }

  public _addToCart(item: any) {
    this._cart.addToCart(item);
    this._send.addObjct(this._cart.getItems().length);
    alert('Đã thêm vào giở hàng thành công');
  }
  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/SanPhams/Get-By-Id/'+ id).subscribe(res => {
        this.item = res;
        console.log(res);       
        setTimeout(() => {
          this.loadScripts('assets/js/main.js');
        });
      });
    });
  }
  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
   }
}
