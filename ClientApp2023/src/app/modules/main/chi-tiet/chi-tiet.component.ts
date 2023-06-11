import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-chi-tiet',
  templateUrl: './chi-tiet.component.html',
  styleUrls: ['./chi-tiet.component.css']
})
export class ChiTietComponent extends BaseComponent implements OnInit,AfterViewInit {
  public list_thongso:any;
  public list_item:any;
  public list_anh:any;
  public thoigian:any;
  public list_tuongtu:any;
  public item:any;
  public item_ma:any;
  public user : any;
  public frmKhach: FormGroup;
  public loc:any;
  public page: any = 1;
  public id: any;
  public pageSize: any = 5;
  public list_phanhoi: any;
  public TrB_sao: any;
  public TrB_sao_sp: any;
  public totalItem: any;
  public discountPercent: number;
  constructor(injector: Injector, private _cart: CartService, private _send: SendService,private authenticationService: AuthenticationService) {
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
        this.item = res.sanpham   
        setTimeout(() => {
          this.loadScripts('assets/js/main.js');
        });
      });
    });
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/SanPhams/'+ id).subscribe(res => {
        this.thoigian = res   
        console.log(this.thoigian);
      });
    });
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/CTAnhSanPhams/get-by-id/'+ id).subscribe(res => {
        this.list_anh = res;    
      });
    });
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/SanPhams/get-tuongtu/'+ id).subscribe(res => {
        this.list_tuongtu = res;    
      });
    });
    
    this.user = this.authenticationService.userValue;
    this.frmKhach = new FormGroup({
      'txt_noidung': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      'txt_sao': new FormControl('', [Validators.required]),
      'txt_masanpham': new FormControl(''),
      'txt_manguoidung': new FormControl(this.user.maNguoiDung),
    });
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/PhanHois/search', { loc: this.loc, page: this.page, pageSize: this.pageSize, ma_san_pham: this.id }).subscribe(res => {
        this.list_phanhoi = res.data;
        this.totalItem = res.totalItem;
      }); 
    });
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/PhanHois/trb_sao', { ma_sanpham: this.id }).subscribe(res => {
        this.TrB_sao = res.result3;
      }); 
    });
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/ThongSoKyThuats/search-ts', { ma_san_pham: this.id }).subscribe(res => {
        this.list_thongso = res.result1;
        console.log(this.list_thongso);
      }); 
    });
      
      
  }
  public loadPage(page: any) {
    this._api.post('/api/PhanHois/search', {loc: this.loc,  page: page, pageSize: this.pageSize, ma_san_pham: this.id }).subscribe(res => {
      this.list_phanhoi = res.data;
      this.totalItem = res.totalItem;
     
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/PhanHois/search', { loc: this.loc, page: 1, pageSize: pageSize, ma_san_pham: this.id }).subscribe(res => {
      this.list_phanhoi = res.data;
      this.totalItem = res.totalItem;
      
    });
  }

  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
  }
  public onSubmit(val: any) {
    if (this.frmKhach.invalid) {
      return;
    }
    let obj: any = {};
    obj.phanhoi = {
      noiDung: val.txt_noidung,
      sao: val.txt_sao,
      maSanPham: val.txt_masanpham,
      maNguoiDung : val.txt_manguoidung,
    };

    debugger;
    this._api.post('/api/PhanHois/create-phanhoi', obj.phanhoi).subscribe(res => {
      if (res && res.data) {
        alert('Thêm dữ liệu thành công')
      } else {
        alert('Có lỗi')
      }
      
    });
  }
}
