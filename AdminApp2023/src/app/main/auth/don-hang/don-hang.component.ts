import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-don-hang',
  templateUrl: './don-hang.component.html',
  styleUrls: ['./don-hang.component.css']
})
export class DonHangComponent extends BaseComponent implements OnInit, AfterViewInit {

  public list_donhang: any;
  public list_chitietdonhang: any;
  public isCreate = false;
  public donhang: any;
  public frmDonHang: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 6;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_trangthai': new FormControl('', []),
      'txt_tenkhachhang': new FormControl('', []),
      'txt_sodienthoai': new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/DonHangs/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, trangthai: this.frmSearch.value['txt_trangthai'], tenkhachhang: this.frmSearch.value['txt_tenkhachhang'], sodienthoai: this.frmSearch.value['txt_sodienthoai']}).subscribe(res => {
      this.list_donhang = res.data;
      this.totalItem = res.totalItem; 
    }); 
  }
  public loadPage(page: any) {
    this._api.post('/api/DonHangs/search', {loc: this.loc,  page: page, pageSize: this.pageSize, trangthai: this.frmSearch.value['txt_trangthai'], tenkhachhang: this.frmSearch.value['txt_tenkhachhang'], sodienthoai: this.frmSearch.value['txt_sodienthoai']}).subscribe(res => {
      this.list_donhang = res.data;
      this.totalItem = res.totalItem;
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/DonHangs/search', {  loc: this.loc, page: 1, pageSize: pageSize, trangthai: this.frmSearch.value['txt_trangthai'], tenkhachhang: this.frmSearch.value['txt_tenkhachhang'], sodienthoai: this.frmSearch.value['txt_sodienthoai']}).subscribe(res => {
      this.list_donhang = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  } 
  public onRemove(MaDonHang: any) {
    this._api.delete('/api/DonHangs/delete-DonHang', MaDonHang).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.LoadData();
    });
  }
  ngAfterViewInit() {
    this.loadScripts('');
  }
  public openUpdateModal(maDonHang: any) {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/DonHangs/Get-By-Id/' + maDonHang).subscribe(res => {
        this.donhang = res;
        console.log(res);
        this.frmDonHang = new FormGroup({
          'txt_trangthaidonhang': new FormControl(this.donhang.trangThaiDonHang, []),
        }, {
        });
        this.doneSetupForm = true;
      });
    });
  }

  public closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmDonHang.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(dhh: any) {
    console.log(this.findInvalidControls())
    if (this.frmDonHang.invalid) {
      return;
    }
    let obj: any = {};
    obj.donhangs = {
      trangThaiDonHang: dhh.txt_trangthaidonhang,
    }
    console.log(obj.donhangs);
    if (this.isCreate)  {
      obj.donhangs.maDonHang = this.donhang.maDonHang;
      console.log(obj.donhangs.maDonHang);
      this._api.post('/api/DonHangs/update-DonHang', obj.donhangs).subscribe(result  => {
        if (result  && result.data) {
          alert('Cập nhật dữ liệu thành công');
          this.LoadData();
          // location.reload();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }
  }
}
