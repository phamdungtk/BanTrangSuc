import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-nha-san-xuat',
  templateUrl: './nha-san-xuat.component.html',
  styleUrls: ['./nha-san-xuat.component.css']
})
export class NhaSanXuatComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public list_nsx: any;
  public nsx: any;
  public isCreate = false;
  public frmNSX: FormGroup;
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
      'txt_tennsx': new FormControl('', []),
    });
  }
  ngOnInit(): void {
    // this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/NhaSanXuats/search-admin', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tennxs: this.frmSearch.value['txt_tennsx']}).subscribe(res => {
      this.list_nsx = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/NhaSanXuats/search-admin', {loc: this.loc,  page: page, pageSize: this.pageSize, tennxs: this.frmSearch.value['txt_tennsx']}).subscribe(res => {
      this.list_nsx = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/NhaSanXuats/search-admin', {  loc: this.loc, page: 1, pageSize: pageSize, tennxs: this.frmSearch.value['txt_tennsx']}).subscribe(res => {
      this.list_nsx = res.data;
      this.totalItem = res.totalItem;
      console.log(res.data);
      console.log(res.totalItem);
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  } 
  fileName= 'nha-san-xuat.xlsx';
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
  get tennsx() {
    return this.frmNSX.get('txt_tennsx')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmNSX = new FormGroup({
        'txt_tennsx': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]), 
        'txt_mota': new FormControl('', []),
      });
    });
  }
  public openUpdateModal(maNhaSanXuat: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/NhaSanXuats/get-by-id/' + maNhaSanXuat).subscribe(res => {
        this.nsx = res.kq;
        console.log(this.nsx);
        this.doneSetupForm = true; 
        this.frmNSX = new FormGroup({
          'txt_tennsx': new FormControl(this.nsx.tenNhaSanXuat, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
          'txt_mota': new FormControl(this.nsx.moTa, []),
        });        
      });
    });
  }

  public onRemove(maNhaSanXuat: any) {
    this._api.delete('/api/NhaSanXuats/delete-nsx', maNhaSanXuat).subscribe(res => {
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
    const controls = this.frmNSX.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(nsx: any) {
    console.log(this.findInvalidControls())
    if (this.frmNSX.invalid) {
      return;
    }
    let obj: any = {};
    obj.NhaSanXuat = {
      TenNhaSanXuat: nsx.txt_tennsx,
      MoTa: nsx.txt_mota,
    }
    console.log(obj.NhaSanXuat);
    if (this.isCreate) {
      this._api.post('/api/NhaSanXuats/create-nsx', obj.NhaSanXuat).subscribe(res => {
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
      obj.NhaSanXuat.maNhaSanXuat = this.nsx.maNhaSanXuat;
      console.log(this.nsx.maNhaSanXuat);
      this._api.post('/api/NhaSanXuats/update-nsx', obj.NhaSanXuat).subscribe(res => {
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