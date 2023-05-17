import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;

@Component({
  selector: 'app-nhom-san-pham',
  templateUrl: './nhom-san-pham.component.html',
  styleUrls: ['./nhom-san-pham.component.css']
})
export class NhomSanPhamComponent extends BaseComponent implements OnInit, AfterViewInit {
  public list_nhomsanpham: any;
  public isCreate = false;
  public nhomsanpham: any;
  public ctanhsanpham: any;
  public frmNhomSanPham: FormGroup;
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
      'txt_tennhom': new FormControl('', []),  
    });
  }

  ngOnInit(): void {
    // this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/NhomSanPhams/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tennhom: this.frmSearch.value['txt_tennhom']}).subscribe(res => {
      this.list_nhomsanpham = res.data;
      this.totalItem = res.totalItem;
    }); 
  }
  public loadPage(page: any) {
    this._api.post('/api/NhomSanPhams/search', {loc: this.loc,  page: page, pageSize: this.pageSize,  tennhom: this.frmSearch.value['txt_tennhom']}).subscribe(res => {
      this.list_nhomsanpham = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/NhomSanPhams/search', {  loc: this.loc, page: 1, pageSize: pageSize,  tennhom: this.frmSearch.value['txt_tennhom']}).subscribe(res => {
      this.list_nhomsanpham = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  get tennhom() {
    return this.frmNhomSanPham.get('txt_tennhom')!;
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmNhomSanPham = new FormGroup({
        'txt_tennhom': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_anhnhom': new FormControl('', [])
      });
    });
  }
  public openUpdateModal(MaNhomSanPham: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/NhomSanPhams/get-by-id/' + MaNhomSanPham).subscribe(res => {
        this.nhomsanpham = res.nhomsanpham;
        this.doneSetupForm = true;
        this.frmNhomSanPham = new FormGroup({
          'txt_tennhom': new FormControl(this.nhomsanpham.tenNhom, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_anhnhom': new FormControl(this.nhomsanpham.anhNhom, []),
        });
      }); 
    });
  }

  public onRemove(MaNhomSanPham: any) {
    this._api.delete('/api/NhomSanPhams/delete-nhomsanpham', MaNhomSanPham).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.LoadData();
    });
  }
  public closeModal() {
    $('#createsanphamModal').closest('.modal').modal('hide');
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
    const controls = this.frmNhomSanPham.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmNhomSanPham.invalid) {
      return;
    }
    let obj: any = {};
    obj.nhomsanpham = {
      tenNhom: vl.txt_tennhom,
      anhNhom: vl.txt_anhnhom,
    }
    if (this.isCreate) { debugger
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'nhomsanpham', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.nhomsanpham.anhNhom = res.body.filePath;
            this._api.post('/api/NhomSanPhams/create-nhomsanpham', obj.nhomsanpham).subscribe(res => {
              if (res && res.data) {
                debugger;
                alert('Thêm dữ liệu thành công');
                this.LoadData();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.post('/api/NhomSanPhams/create-nhomsanpham', obj.nhomsanpham).subscribe(res => {
          if (res && res.data) {
            alert('Thêm dữ liệu thành công');
            this.LoadData();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    } else {
      obj.nhomsanpham.MaNhomSanPham = this.nhomsanpham.maNhomSanPham;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'nhomsanpham', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.nhomsanpham.anhNhom = res.body.filePath;
            this._api.post('/api/NhomSanPhams/update-nhomsanpham', obj.nhomsanpham).subscribe(res => {
              debugger;
              if (res && res.data) {
                alert('Cập nhật dữ liệu thành công');
                this.LoadData();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.post('/api/NhomSanPhams/update-nhomsanpham', obj.nhomsanpham).subscribe(res => {
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
}
