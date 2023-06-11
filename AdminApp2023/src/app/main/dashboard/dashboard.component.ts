import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {
  public tong_sl_donhang: any;
  public tong_tien: any;
  public tong_tien_ngay: any;
  public tong_tien_tuan: any;
  public tong_tien_thang: any;
  public tong_tien_quy: any;
  public tong_tien_nam: any;
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
  public filterForm: FormGroup;
  public totalRevenue: number;
  // public filter: any;
  // public startDate: any;
  public loc: any;
  constructor(injector: Injector,private http: HttpClient, private apiService: ApiService) {
    super(injector);
  }
  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this._api.get('/api/ThongKes/thongketong-DonHang').subscribe(res => {
      this.tong_sl_donhang = res.result;
    
      setTimeout(() => {
        this.loadScripts('assets/dist/js/demo.js','assets/dist/js/adminlte.min.js' );
      });
    });
    this._api.get('/api/ThongKes/thongketongauth').subscribe(res => {
      this.tong_sl_auth = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongssp').subscribe(res => {
      this.tong_sl_sp = res.result;
    
    });
    
    this._api.get('/api/ThongKes/daily-ngay').subscribe(res => {
      this.tong_tien_ngay = res.formatted;
     
    });
    this._api.get('/api/ThongKes/weekly-tuan').subscribe(res => {
      this.tong_tien_tuan = res.formatted;
     
    });
    this._api.get('/api/ThongKes/monthly-thang').subscribe(res => {
      this.tong_tien_thang = res.formatted;
     
    });
    this._api.get('/api/ThongKes/quarterly-quy').subscribe(res => {
      this.tong_tien_quy = res.formatted;
     
    });
    this._api.get('/api/ThongKes/annual-nam').subscribe(res => {
      this.tong_tien_nam = res.formatted;
     
    });
    this._api.get('/api/ThongKes/thongketongdm').subscribe(res => {
      this.tong_sl_dm = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketonghdn').subscribe(res => {
      this.tong_sl_hdn = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongnsp').subscribe(res => {
      this.tong_sl_nsp = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongdvt').subscribe(res => {
      this.tong_sl_dvt = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongnsx').subscribe(res => {
      this.tong_sl_nsx = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongncc').subscribe(res => {
      this.tong_sl_ncc = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongtt').subscribe(res => {
      this.tong_sl_tt = res.result;
    
    });
    this._api.get('/api/ThongKes/thongketongdg').subscribe(res => {
      this.tong_sl_dg = res.result;
    
    });
    this._api.get('/api/ThongKes/').subscribe(res => {
      this.tong_tien = res.result;
    
    });
    const filter = 'day'; // Giá trị của filter có thể là 'day', 'week', 'month', 'quarter', 'year'
    const startDate = '2023-06-01'; // Giá trị của startDate phải có định dạng 'yyyy-mm-dd'
    this._api.post('/api/ThongKes/' + filter + '/' + startDate, {}).subscribe(res => {
      console.log(res); // In kết quả trả về từ API ra console
    });
    
    
    
  }
 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc);   
  }
  // onSubmit() {
  //   const url = `/api/ThongKes/${this.year}/${this.month}/${this.day}`;
  //   this.http.get<number>(url).subscribe((result) => {
  //     this.totalSales = result || 0;
  //   });
  // }
  ngAfterViewInit() {
    // this.loadScripts('assets/dist/js/demo.js','assets/dist/js/adminlte.min.js' );
  }
}