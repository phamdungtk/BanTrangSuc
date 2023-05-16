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
  public list_anh:any;
  public list_tuongtu:any;
  public item:any;
  constructor(injector: Injector, private _cart: CartService, private _send: SendService) {
    super(injector);
  }

  public _addToCart(item: any) {
    this._cart.addToCart(item);
    this._send.addObjct(this._cart.getItems().length);
    alert('Đã thêm vào giở hàng thành công');
  }
  applyDiscount(gia: number, phanTram: number): number {
    let finalPrice: number = gia - gia * (phanTram / 100);
    return finalPrice;
  }
  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/SanPhams/get-by-id/'+ id).subscribe(res => {
        this.item = res.sanpham;
        console.log(res.sanpham);       
        setTimeout(() => {
          this.loadScripts('assets/js/main.js');
        });
      });
    });
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/CTAnhSanPhams/get-by-id/'+ id).subscribe(res => {
        this.list_anh = res;
        console.log(this.list_anh);       
      });
    });
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/SanPhams/get-tuongtu/'+ id).subscribe(res => {
        this.list_tuongtu = res;
        console.log(this.list_tuongtu);       
      });
    });
  }
  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
  }
}
