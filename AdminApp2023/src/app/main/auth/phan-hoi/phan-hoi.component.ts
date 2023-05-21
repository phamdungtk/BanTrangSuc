import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;

@Component({
  selector: 'app-phan-hoi',
  templateUrl: './phan-hoi.component.html',
  styleUrls: ['./phan-hoi.component.css']
})
export class PhanHoiComponent extends BaseComponent implements OnInit, AfterViewInit {
  public list_phanhoi: any;
  public list_sanpham: any;
  public isCreate = false;
  public ctanhsanpham: any;
  public id: any;
  public frmPhanHoi: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public showUpdateModalCTA: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 5;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_ma_san_pham': new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/PhanHois/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, ma_san_pham: this.id}).subscribe(res => {
        this.list_phanhoi = res.data;
        this.totalItem = res.totalItem;
        console.log(res.data);
      }); 
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/PhanHois/search', {loc: this.loc,  page: page, pageSize: this.pageSize, ma_san_pham: this.id}).subscribe(res => {
      this.list_phanhoi = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/PhanHois/search', {  loc: this.loc, page: 1, pageSize: pageSize, ma_san_pham: this.id}).subscribe(res => {
      this.list_phanhoi = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  // public createModal() {
  //   this.showUpdateModal = true;
  //   this.isCreate = true;
  //   setTimeout(() => {
  //     $('#createsanphamModal').modal('toggle');
  //     this.doneSetupForm = true;
  //     this.frmPhanHoi = new FormGroup({
  //       'txt_noidung': new FormControl('', []),
  //     });
  //   });
  // }

  public onRemove(MaPhanHoi: any) {
    this._api.delete('/api/PhanHois/delete-phanhoi', MaPhanHoi).subscribe(res => {
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

  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmPhanHoi.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  // OnSubmit(vl: any) {
  //   console.log(this.findInvalidControls())
  //   if (this.frmPhanHoi.invalid) {
  //     return;
  //   }
  //   let obj: any = {};
  //   obj.phanhoi = {
  //     noiDung: vl.txt_noidung,
  //   }
  //   if (this.isCreate) {
  //     this._api.post('/api/PhanHois/create-phanhoi', obj.phanhoi).subscribe(res => {
  //       if (res && res.data) {
  //         alert('Thêm dữ liệu thành công');
  //         debugger
  //         this.LoadData();
  //         this.closeModal();
  //       } else {
  //         alert('Có lỗi')
  //       }
  //     });
  //   } 
  // }
}
