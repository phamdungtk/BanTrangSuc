import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-nhom-san-pham',
  templateUrl: './nhom-san-pham.component.html',
  styleUrls: ['./nhom-san-pham.component.css']
})
export class NhomSanPhamComponent extends BaseComponent implements OnInit {
  public loc:any;
  public page: any = 1;
  public id: any;
  public pageSize: any = 1;
  public list_item: any;
  public totalItem: any;
  public danh_sach_nhom:any;
  public danh_sach_danh_muc:any;
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
    this.loc = localStorage.getItem('loc') || '';
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/NhomSanPhams/searchnhom', { loc: this.loc, page: this.page, pageSize: this.pageSize, ma_nhom_sp: this.id }).subscribe(res => {
        this.danh_sach_nhom = res.data;
        this.totalItem = res.totalItem;
        console.log(res.data);
        setTimeout(() => {
          this.loadScripts('assets/js/main.js');
        });
      }); 
    });
    this._api.get('/api/LoaiSanPhams/get-loai-sanpham').subscribe(res => {
      this.danh_sach_danh_muc = res;
      
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/NhomSanPhams/searchnhom', {loc: this.loc,  page: page, pageSize: this.pageSize, ma_nhom_sp: this.id }).subscribe(res => {
      this.list_item = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/NhomSanPhams/searchnhom', { loc: this.loc, page: 1, pageSize: pageSize, ma_nhom_sp: this.id }).subscribe(res => {
      this.list_item = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }

  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
}