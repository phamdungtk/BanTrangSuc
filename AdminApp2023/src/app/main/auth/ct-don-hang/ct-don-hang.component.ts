import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { BaseComponent } from 'src/app/core/common/base-component';
// import { ExcelService } from 'src/app/core/services/excel.service';
// import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx';

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
  public user: any;

  constructor(injector: Injector,  private authenticationService: AuthenticationService ) {
    super(injector); 
  }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
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
  fileName= 'chi-tiet-don-hang.xlsx';
  public exportExcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }
 
  
  ngAfterViewInit() {
    this.loadScripts('');
  }
}
