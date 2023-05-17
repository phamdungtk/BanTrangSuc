import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import { ApiService } from 'src/app/core/services/api.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent extends BaseComponent implements OnInit,AfterViewInit{

  
  public danh_sach_san_pham:any;
  public danh_sach_danh_muc:any;
  public frmSearch: FormGroup;
  constructor(injector: Injector,private _send: SendService, private _cart: CartService,) {
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
    this._api.get('/api/SanPhams/Get-All').subscribe(res => {
      this.danh_sach_san_pham = res;
      setTimeout(() => {
        this.loadScripts('assets/js/main.js');
      });
    });
    this._api.get('/api/LoaiSanPhams/get-loai-sanpham').subscribe(res => {
      this.danh_sach_danh_muc = res;
    });
  }

  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
   }
}
