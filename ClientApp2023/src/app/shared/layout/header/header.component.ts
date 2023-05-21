import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { BaseComponent } from 'src/app/core/common/base-component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit,AfterViewInit{
  public user: any; 
  public sosanphams:any=0;
  public list: any;
  public tTong: any;
  public isCreate = false;
  public list_timkiem: any;
  public frmSearch: FormGroup;
  public loaiQuyen: string = 'Admin';
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 6;
  public totalItem: any;
  public danh_sach_danh_muc:any;
  public thuong_hieu:any;
  constructor(injector: Injector,private _router: Router,private _send: SendService, private _cart: CartService,private authenticationService: AuthenticationService) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_tensanpham': new FormControl('', [Validators.required]),
      'txt_tendanhmuc': new FormControl('', [Validators.required]),
    });
  }
  
  public ThanhToan () {
    this._router.navigate(['/customers/thanhtoan']);
  }
  public dangky () {
    this._router.navigate(['/register']);
  }
  public dangnhap () {
    this._router.navigate(['/login']);
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
    this.user = this.authenticationService.userValue;
    this.list = JSON.parse(localStorage.getItem('cart') || '[]');
    this.tTong = this.list.reduce((sum:any, x:any) => sum +  x.gia * x.quantity, 0);
    this.sosanphams=this._cart.getItems().length;
    this._send.objs.subscribe((res: any) => {
      if(res) {
        this.sosanphams=res;
      }
    });
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/SanPhams/timkiem', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc']}).subscribe(res => {
      this.list_timkiem = res.data;
      this.totalItem = res.totalItem;
      // console.log(this.list_timkiem);
    }); 
    this._api.get('/api/LoaiSanPhams/get-loai-sanpham').subscribe(res => {
      this.danh_sach_danh_muc = res;
    });
    this._api.get('/api/NhaSanXuats/Get-All').subscribe(res => {
      this.thuong_hieu = res;
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/SanPhams/timkiem', {loc: this.loc,  page: page, pageSize: this.pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc']}).subscribe(res => {
      this.list_timkiem = res.data;
      this.totalItem = res.totalItem;
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/SanPhams/timkiem', {  loc: this.loc, page: 1, pageSize: pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc']}).subscribe(res => {
      this.list_timkiem = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  logout() {
    this.authenticationService.logout();
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
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

