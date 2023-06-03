import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import MatchValidation from 'src/app/core/helpers/must-match.validator';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-danh-muc',
  templateUrl: './danh-muc.component.html',
  styleUrls: ['./danh-muc.component.css']
})
export class DanhMucComponent extends BaseComponent implements OnInit, AfterViewInit {
  public list_loaisanpham: any;
  public list_maloai: any;
  public mdm: string = "";
  public isCreate = false;
  public loai: any;
  public frmLoai: FormGroup;
  public frmSearch: FormGroup;
  public loaiQuyen: string = 'Admin';
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 5;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({ 
      'txt_tendanhmuc': new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/LoaiSanPhams/search-admin', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tendanhmuc: this.frmSearch.value['txt_tendanhmuc']}).subscribe(res => {
      this.list_loaisanpham = res.data;
      this.totalItem = res.totalItem;
      // console.log(res.data);
      // console.log(res.totalItem);
    });
    this._api.get('/api/LoaiSanPhams/Get-All').subscribe(res => {
      this.list_maloai = res;      
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/LoaiSanPhams/search-admin', {loc: this.loc,  page: page, pageSize: this.pageSize, tendanhmuc: this.frmSearch.value['txt_tendanhmuc']}).subscribe(res => {
      this.list_loaisanpham = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/LoaiSanPhams/search-admin', {  loc: this.loc, page: 1, pageSize: pageSize, tendanhmuc: this.frmSearch.value['txt_tendanhmuc']}).subscribe(res => {
      this.list_loaisanpham = res.data;
      this.totalItem = res.totalItem;
      console.log(res.data);
      console.log(res.totalItem);
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  } 
  fileName= 'danh-muc.xlsx';
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
 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  get tendanhmuc() {
    return this.frmLoai.get('txt_tendanhmuc')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmLoai = new FormGroup({
        'txt_madanhmuccha': new FormControl('', []), 
        'txt_tendanhmuc': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]), 

      });
    });
  }
  public openUpdateModal(maDanhMuc: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/LoaiSanPhams/get-by-id/' + maDanhMuc).subscribe(res => {
        this.loai = res.kq;
        console.log(this.loai);
        this.doneSetupForm = true; 
        this.frmLoai = new FormGroup({
          'txt_madanhmuccha': new FormControl(''), 
          'txt_tendanhmuc': new FormControl(this.loai.tenDanhMuc, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
        }); 
        this.mdm = this.loai.maDanhMucCha;    
        console.log(this.mdm );  
      });
    });
  }

  public onRemove(maDanhMuc: any) {
    this._api.delete('/api/LoaiSanPhams/delete-loai', maDanhMuc).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.LoadData();
    });
  }
  public closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
  public pwdCheckValidator(control: any) {
    var filteredStrings = { search: control.value, select: '@#!$%&*' }
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if (control.value.length < 6 || !result) {
      return { matkhau: true };
    } else {
      return null;
    }
  }
  ngAfterViewInit() {
    this.loadScripts('');
  }
  public upload(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmLoai.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(dm: any) {
    console.log(this.findInvalidControls())
    if (this.frmLoai.invalid) {
      return;
    }
    let obj: any = {};
    obj.DanhMuc = {
      maDanhMucCha:dm.txt_madanhmuccha,
      tenDanhMuc: dm.txt_tendanhmuc,
      stt: 1,
      trangThai: true,
    }
    console.log(obj.DanhMuc);
    if (this.isCreate) {
      this._api.post('/api/LoaiSanPhams/create-loai', obj.DanhMuc).subscribe(res => {
        if (res && res.data) {
          console.log(res.data);
          alert('Thêm dữ liệu thành công');
          this.LoadData();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    } else {
      obj.DanhMuc.maDanhMuc = this.loai.maDanhMuc;
      console.log(this.loai.maDanhMuc);
      this._api.post('/api/LoaiSanPhams/update-loai', obj.DanhMuc).subscribe(res => {
        if (res && res.data) {
          alert('Cập nhật dữ liệu thành công');
          this.LoadData();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    }
  }
}