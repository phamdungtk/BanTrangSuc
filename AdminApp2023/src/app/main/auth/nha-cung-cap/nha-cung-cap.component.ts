import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-nha-cung-cap',
  templateUrl: './nha-cung-cap.component.html',
  styleUrls: ['./nha-cung-cap.component.css']
})
export class NhaCungCapComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public list_ncc: any;
  public ncc: any;
  public isCreate = false;
  public frmNCC: FormGroup;
  public frmSearch: FormGroup;
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
      'txt_tenncc': new FormControl('', []),
    });
  }
  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/NhaCungCaps/search-admin', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tenncc: this.frmSearch.value['txt_tenncc']}).subscribe(res => {
      this.list_ncc = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/NhaCungCaps/search-admin', {loc: this.loc,  page: page, pageSize: this.pageSize, tenncc: this.frmSearch.value['txt_tenncc']}).subscribe(res => {
      this.list_ncc = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/NhaCungCaps/search-admin', {  loc: this.loc, page: 1, pageSize: pageSize, tenncc: this.frmSearch.value['txt_tenncc']}).subscribe(res => {
      this.list_ncc = res.data;
      this.totalItem = res.totalItem;
      console.log(res.data);
      console.log(res.totalItem);
    });
  } 
  fileName= 'nha-cung-cap.xlsx';
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
  get tenncc() {
    return this.frmNCC.get('txt_tenncc')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmNCC = new FormGroup({
        'txt_tenncc': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]), 
        'txt_diachi': new FormControl('', []),
        'txt_sdt': new FormControl('', []),
        'txt_email': new FormControl('', []),
      });
    });
  }
  public openUpdateModal(maNhaCungCap: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/NhaCungCaps/get-by-id/' + maNhaCungCap).subscribe(res => {
        this.ncc = res.kq;
        console.log(this.ncc);
        this.doneSetupForm = true; 
        this.frmNCC = new FormGroup({
          'txt_tenncc': new FormControl(this.ncc.tenNhaCungCap, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
          'txt_diachi': new FormControl(this.ncc.diaChi, []),
          'txt_sdt': new FormControl(this.ncc.soDienThoai, []),
          'txt_email': new FormControl(this.ncc.email, []),
        });        
      });
    });
  }

  public onRemove(maNhaCungCap: any) {
    this._api.delete('/api/NhaCungCaps/delete-ncc', maNhaCungCap).subscribe(res => {
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
    const controls = this.frmNCC.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(ncc: any) {
    console.log(this.findInvalidControls())
    if (this.frmNCC.invalid) {
      return;
    }
    let obj: any = {};
    obj.NhaCungCap = {
      TenNhaCungCap: ncc.txt_tenncc,
      DiaChi: ncc.txt_diachi,
      SoDienThoai: ncc.txt_sdt,
      Email: ncc.txt_email,
    }
    console.log(obj.NhaCungCap);
    if (this.isCreate) {
      this._api.post('/api/NhaCungCaps/create-ncc', obj.NhaCungCap).subscribe(res => {
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
      obj.NhaCungCap.maNhaCungCap = this.ncc.maNhaCungCap;
      console.log(this.ncc.maNhaCungCap);
      this._api.post('/api/NhaCungCaps/update-ncc', obj.NhaCungCap).subscribe(res => {
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