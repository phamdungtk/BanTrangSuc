import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/common/base-component';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit,AfterViewInit{
  public sosanphams:any=0;
  public list: any;
  public tTong: any;
  constructor(injector: Injector,private _router: Router,private _send: SendService, private _cart: CartService,) {
    super(injector);
  }
  public ThanhToan () {
    this._router.navigate(['/customers/thanhtoan']);
  }
  ngOnInit(): void {
    this.list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.tTong = this.list.reduce((sum:any, x:any) => sum +  x.gia * x.quantity, 0);
    this.sosanphams=this._cart.getItems().length;
    this._send.objs.subscribe((res: any) => {
      if(res) {
        this.sosanphams=res;
      }
    });
  }
  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
  }
  public Xoa(maSanPham: any) {
    if (confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng!")) {
      this._cart.deleteItem(maSanPham);   
      var index = this.list.findIndex((x: any) => x.maSanPham == maSanPham);
      if (index >= 0) {
        this.list.splice(index, 1);
        this.tTong = this.list.reduce((sum:any, x:any) => sum + x.gia  * x.quantity, 0);
      } 
    }
  }
}

