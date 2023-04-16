import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;

@Component({
  selector: 'app-don-vi-tinh',
  templateUrl: './don-vi-tinh.component.html',
  styleUrls: ['./don-vi-tinh.component.css']
})
export class DonViTinhComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public list_dvt: any;
  public dvt: any;
  public isCreate = false;
  public frmDVT: FormGroup;
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
      'txt_tendvt': new FormControl('', []),
    });
  }
  ngOnInit(): void {
    // this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/DonViTinhs/search-admin', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tendvt: this.frmSearch.value['txt_tendvt']}).subscribe(res => {
      this.list_dvt = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/DonViTinhs/search-admin', {loc: this.loc,  page: page, pageSize: this.pageSize, tendvt: this.frmSearch.value['txt_tendvt']}).subscribe(res => {
      this.list_dvt = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/DonViTinhs/search-admin', {  loc: this.loc, page: 1, pageSize: pageSize, tendvt: this.frmSearch.value['txt_tendvt']}).subscribe(res => {
      this.list_dvt = res.data;
      this.totalItem = res.totalItem;
      console.log(res.data);
      console.log(res.totalItem);
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  get tendvt() {
    return this.frmDVT.get('txt_tendvt')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmDVT = new FormGroup({
        'txt_tendvt': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]), 
      });
    });
  }
  public openUpdateModal(maDonViTinh: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/DonViTinhs/get-by-id/' + maDonViTinh).subscribe(res => {
        this.dvt = res.kq;
        console.log(this.dvt);
        this.doneSetupForm = true; 
        this.frmDVT = new FormGroup({
          'txt_tendvt': new FormControl(this.dvt.tenDonViTinh, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
        });        
      });
    });
  }

  public onRemove(maDonViTinh: any) {
    this._api.delete('/api/DonViTinhs/delete-dvt', maDonViTinh).subscribe(res => {
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
    const controls = this.frmDVT.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(dvt: any) {
    console.log(this.findInvalidControls())
    if (this.frmDVT.invalid) {
      return;
    }
    let obj: any = {};
    obj.DonViTinh = {
      TenDonViTinh: dvt.txt_tendvt,
    }
    console.log(obj.DonViTinh);
    if (this.isCreate) {
      this._api.post('/api/DonViTinhs/create-dvt', obj.DonViTinh).subscribe(res => {
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
      obj.DonViTinh.maDonViTinh = this.dvt.maDonViTinh;
      console.log(this.dvt.maDonViTinh);
      this._api.post('/api/DonViTinhs/update-dvt', obj.DonViTinh).subscribe(res => {
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