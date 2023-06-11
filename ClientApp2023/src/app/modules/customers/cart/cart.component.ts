import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/common/base-component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent extends BaseComponent implements OnInit, AfterViewInit {
  public list: any;
  public list_lichsu: any;
  public tTong: any;
  public tTonghd: any;
  public tTongGiamGia: any;
  public id: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 4;
  public totalItem: any;
  public user : any;
  constructor(injector: Injector,private _router: Router,private _send: SendService, private _cart: CartService,private authenticationService: AuthenticationService) {
    super(injector);
  }

  public ThanhToan () {
    this._router.navigate(['/customers/check-out']);
  }
  applyDiscount(gia: number, phanTram: number): number {
    let finalPrice: number = gia - gia * (phanTram / 100);
    return finalPrice;
  }
  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
    this.list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.tTong = this.list.reduce((sum: any, x: any) => sum + x.gia * x.quantity, 0);
    this.tTongGiamGia = this.list.reduce((sum:any, x:any) => sum +  (x.gia - x.gia * (x.phanTram / 100)) * x.quantity, 0);
  }
  public LoadData() {
    this.id = this.user.maNguoiDung;
    console.log(this.user.maNguoiDung);    
    this._api.post('/api/DonHangs/search-lichsu', {  loc: this.loc, page: this.page, pageSize: this.pageSize, ma_nguoi_dung: this.id}).subscribe(res => {
      this.list_lichsu = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('assets/js/main.js');
      });
      console.log(res.data);
    }); 
    this._api.post('/api/ThongKes/tong-dh-theo-mand', {ma_nguoidung: this.id}).subscribe(res => {
      this.tTonghd = res.tongTienn;
      console.log(res);
    });   
     
  }
  public loadPage(page: any) {
    this._api.post('/api/DonHangs/search-lichsu', {loc: this.loc,  page: page, pageSize: this.pageSize, ma_nguoi_dung: this.id}).subscribe(res => {
      this.list_lichsu = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/DonHangs/search-lichsu', {  loc: this.loc, page: 1, pageSize: pageSize, ma_nguoi_dung: this.id}).subscribe(res => {
      this.list_lichsu = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  } 
  ngAfterViewInit() {
    this.loadScripts('');
  }
  public Giam(maSanPham: any) {
    var index = this.list.findIndex((x: any) => x.maSanPham == maSanPham);
    if (index >= 0 && this.list[index].quantity >= 1) {
      this.list[index].quantity -= 1;
      this.tTong = this.list.reduce((sum:any, x:any) => sum + x.gia  * x.quantity, 0);
    }
  }
  public Tang(maSanPham: any) {
    var index = this.list.findIndex((x: any) => x.maSanPham == maSanPham);
    if (index >= 0) {
      this.list[index].quantity += 1;
      this.tTong = this.list.reduce((sum:any, x:any) => sum + x.gia  * x.quantity, 0);
    }
  }
  public XoaCart() {
    if (confirm("Bạn muốn xóa tất cả sản phẩm khỏi giỏ hàng!")) {
        localStorage.setItem('cart','');
        this.list = null;
        this.tTong = 0;
    }
  }
  // public updateCart() {
  //   localStorage.setItem('cart', JSON.stringify(this.list));
  //   alert("Đã cập nhật thông tin giỏ hàng thành công!");
  // }
  public updateCart() {
    this.list = this.list.filter((x: any) => x.quantity > 0);
    alert("Số Lượng 0 Sản Phẩm Bị Xoá!");
       // Check the quantity of each product before updating the cart
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].quantity > 10) {
        this.list[i].quantity = 10;
        alert("Số Lượng Không Được Quán 10 Sản Phân Nha!");
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.list));
    alert("Đã cập nhật thông tin giỏ hàng thành công!");
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
