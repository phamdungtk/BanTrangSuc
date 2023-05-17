import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-ct-don-hang',
  templateUrl: './ct-don-hang.component.html',
  styleUrls: ['./ct-don-hang.component.css']
})
export class CtDonHangComponent extends BaseComponent implements OnInit, AfterViewInit {
  public list_ctdonhang: any;
  public tTong: any;
  public id: any;
  public frmCTDonHang: FormGroup;
  public frmSearch: FormGroup;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 5;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      // 'txt_ma_don_hang': new FormControl('', [Validators.required]),
      
    });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/DonHangs/search-ct', {  loc: this.loc, page: this.page, pageSize: this.pageSize, ma_don_hang: this.id}).subscribe(res => {
        this.list_ctdonhang = res.data;
        this.totalItem = res.totalItem;
        console.log(res.data);
      }); 
    }); 
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/ThongKes/tong-don-hang-theo-ma', { ma_don_hang: this.id}).subscribe(res => {
        this.tTong = res;
        console.log(res);
      }); 
    }); 
    
  }
  public loadPage(page: any) {
    this._api.post('/api/DonHangs/search-ct', {loc: this.loc,  page: page, pageSize: this.pageSize, ma_don_hang: this.id}).subscribe(res => {
      this.list_ctdonhang = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/DonHangs/search-ct', {  loc: this.loc, page: 1, pageSize: pageSize, ma_don_hang: this.id}).subscribe(res => {
      this.list_ctdonhang = res.data;
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
}
