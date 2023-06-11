import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';
import { BaseComponent } from 'src/app/core/common/base-component';
import { ProductService } from 'src/app/core/services/Product.service';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent extends BaseComponent implements OnInit,AfterViewInit{

  products: any[] = [];
  public danh_sach_san_pham:any;
  public san_pham:any;
  public msp:any;
  public list_nhieungmua:any;
  public list_donggia:any;
  public danh_sach_danh_muc:any;
  public danh_sach_nhom:any;  
  public user:any;
  public list_thoigian:any;
  public thoigian:any;
  public frmSearch: FormGroup;
  constructor(injector: Injector,private productService: ProductService,private _send: SendService, private _cart: CartService,private authenticationService: AuthenticationService) {
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
//   isExpired(thoiGianKetThuc: string){
//     const end = new Date(thoiGianKetThuc).getTime();
//     const now = new Date().getTime();
//     if(end < now){
//         return true;
//     }
//     return false;
// }
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
      // for (let san_pham of this.danh_sach_san_pham) {
      //   // console.log(san_pham.thoiGianKetThuc);
      //   const ma_san_pham = san_pham.maSanPham
      //   this._api.get('/api/SanPhams/'+ ma_san_pham).subscribe(res => {
      //     this.thoigian = res   
      //     console.log(this.thoigian);
      //   });
      // }
    });
    // this._api.get('/api/SanPhams/Get-All').subscribe((data: any[]) => {
    //   this.danh_sach_san_pham = data;
    //      setTimeout(() => {
    //     this.loadScripts('assets/js/main.js');
    //   });
    //   const apiRequests = [];
    //   for (let san_pham of this.danh_sach_san_pham) {
    //     const ma_san_pham = san_pham.maSanPham;
    //     apiRequests.push(this._api.get(`/api/SanPhams/${ma_san_pham}`));
    //   }

    //   forkJoin(apiRequests).subscribe((results: any[]) => {
    //     for (let i = 0; i < results.length; i++) {
    //       const result = results[i];
    //       this.danh_sach_san_pham[i].expired = result;
    //       console.log(this.danh_sach_san_pham[i].expired);
          
    //     }
    //   });
    // });
    
    
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
  //   this._route.params.subscribe(params => {
  //     let id = params['id'];
  //     this._api.get('/api/SanPhams/get/'+ id).subscribe(res => {
  //         this.list_thoigian = res;
  //         console.log(res);
  //       });
  // //  }
  //   });
    // this._route.params.subscribe(params => {
    //   let id = params['id'];
    //   this._api.get('/api/SanPhams/get/'+ id).subscribe(res => {
    //     this.list_thoigian = res;    
    //   });
    // });
     // Lấy dữ liệu sản phẩm từ Backend và kiểm tra xem sản phẩm đã hết hạn hay chưa
    //  this.productService.isExpired(thoiGianKetThuc: any).subscribe(data => {
    //   this.products = data;
    //   for(let i=0; i<this.products.length; i++){
    //     this.productService.isExpired(this.products[i].thoiGianKetThuc).subscribe(result => {
    //       this.products[i].expired = result;
    //     });
    //   }
    // });
  }
  
  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
   }
}
