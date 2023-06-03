import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {
  public tong_sl_donhang: any;
  public tong_tien: any;
  public tong_sl_auth: any;
  public tong_sl_sp: any;
  public tong_sl_dm: any;
  public tong_sl_hdn: any;
  public tong_sl_nsp: any;
  public tong_sl_dvt: any;
  public tong_sl_nsx: any;
  public tong_sl_ncc: any;
  public tong_sl_tt: any;
  public tong_sl_dg: any;
  constructor(injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    this._api.get('/api/ThongKes/thongketong-DonHang').subscribe(res => {
      this.tong_sl_donhang = res.result;
      console.log(res.result);
      setTimeout(() => {
        this.loadScripts('assets/dist/js/demo.js','assets/dist/js/adminlte.min.js' );
      });
    });
    this._api.get('/api/ThongKes/thongketongauth').subscribe(res => {
      this.tong_sl_auth = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongssp').subscribe(res => {
      this.tong_sl_sp = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketong').subscribe(res => {
      this.tong_tien = res.formatted;
      console.log(res.formatted);
    });
    this._api.get('/api/ThongKes/thongketongdm').subscribe(res => {
      this.tong_sl_dm = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketonghdn').subscribe(res => {
      this.tong_sl_hdn = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongnsp').subscribe(res => {
      this.tong_sl_nsp = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongdvt').subscribe(res => {
      this.tong_sl_dvt = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongnsx').subscribe(res => {
      this.tong_sl_nsx = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongncc').subscribe(res => {
      this.tong_sl_ncc = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongtt').subscribe(res => {
      this.tong_sl_tt = res.result;
      console.log(res.result);
    });
    this._api.get('/api/ThongKes/thongketongdg').subscribe(res => {
      this.tong_sl_dg = res.result;
      console.log(res.result);
    });
  }
  ngAfterViewInit() {
    // this.loadScripts('assets/dist/js/demo.js','assets/dist/js/adminlte.min.js' );
  }
}