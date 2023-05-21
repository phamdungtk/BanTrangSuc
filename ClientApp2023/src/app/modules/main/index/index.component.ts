import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';
import { BaseComponent } from 'src/app/core/common/base-component';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent extends BaseComponent implements OnInit,AfterViewInit{

  
  public danh_sach_san_pham:any;
  public list_nhieungmua:any;
  public list_donggia:any;
  public danh_sach_danh_muc:any;
  public danh_sach_nhom:any;  
  public user:any;
  public frmSearch: FormGroup;
  constructor(injector: Injector,private _send: SendService, private _cart: CartService,private authenticationService: AuthenticationService) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_gia': new FormControl('', []),
    });
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
    this.LoadData();

  }
  public LoadData() {
    this.user = this.authenticationService.userValue;
    this._api.get('/api/SanPhams/Get-All').subscribe(res => {
      this.danh_sach_san_pham = res;
      setTimeout(() => {
        this.loadScripts('assets/js/main.js');
      });
    });
    this._api.get('/api/ThongKes/get-sp-banchay').subscribe(res => {
      this.list_nhieungmua = res.listbanchay;
    });
    this._api.get('/api/SanPhams/Get-All-Donggia').subscribe(res => {
      this.list_donggia = res;
      console.log(this.list_donggia);
    });
    this._api.get('/api/LoaiSanPhams/get-loai-sanpham').subscribe(res => {
      this.danh_sach_danh_muc = res;
    });
    this._api.get('/api/NhomSanPhams/Get-All').subscribe(res => {
      this.danh_sach_nhom = res;
      // console.log(res);
    });
  }

  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
   }
}
