import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;

@Component({
  selector: 'app-thong-so-ky-thuat',
  templateUrl: './thong-so-ky-thuat.component.html',
  styleUrls: ['./thong-so-ky-thuat.component.css']
})
export class ThongSoKyThuatComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public msp: string = "";
  public list_thongso: any;
  public list_sanpham: any;
  public isCreate = false;
  public thongso: any;
  public id: any;
  public frmThongSo: FormGroup;
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
    // this.frmSearch = new FormGroup({
    //   'txt_ma_san_pham': new FormControl('', [Validators.required]),
    // });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/ThongSoKyThuats/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, ma_san_pham: this.id}).subscribe(res => {
        this.list_thongso = res.data;
        this.totalItem = res.totalItem;
        // console.log(res.data);
      }); 
    });
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._api.post('/api/ThongSoKyThuats/search-sp', { ma_san_pham: this.id}).subscribe(res => {
        this.list_sanpham = res.result1;
        console.log(res.result1);
      }); 
    });
    // this._api.get('/api/SanPhams/Get-All').subscribe(res => {
    //   this.list_sanpham = res;
    // });

  }
  public loadPage(page: any) {
    this._api.post('/api/ThongSoKyThuats/search', {loc: this.loc,  page: page, pageSize: this.pageSize, ma_san_pham: this.id}).subscribe(res => {
      this.list_thongso = res.data;
      this.totalItem = res.totalItem;
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/ThongSoKyThuats/search', {  loc: this.loc, page: 1, pageSize: pageSize, ma_san_pham: this.id}).subscribe(res => {
      this.list_thongso = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmThongSo = new FormGroup({
        'txt_masp': new FormControl('', []),
        'txt_tenthongso': new FormControl('', []),
        'txt_mota': new FormControl('', []),
      });
    });
  }
  public openUpdateModal(maThongSo: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/ThongSoKyThuats/get-by-id-tskt/' + maThongSo).subscribe(res => {
        this.thongso = res.kq;
        console.log(this.thongso);
  
        this.doneSetupForm = true;
        this.frmThongSo = new FormGroup({
          'txt_masp': new FormControl(),
          'txt_tenthongso': new FormControl(this.thongso.tenThongSo, []),
          'txt_mota': new FormControl(this.thongso.moTa, []),
        });
        this.msp = this.thongso.maSanPham;
      });

    });
  }
 
  public onRemove(maThongSo: any) {
    this._api.delete('/api/ThongSoKyThuats/delete-tskt', maThongSo).subscribe(res => {
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
    const controls = this.frmThongSo.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmThongSo.invalid) {
      return;
    }
    let obj: any = {};
    obj.thongsokythuat = {
      maSanPham: vl.txt_masp,
      tenThongSo: vl.txt_tenthongso,
      moTa: vl.txt_mota
    }
    if (this.isCreate) {
      this._api.post('/api/ThongSoKyThuats/create-tskt', obj.thongsokythuat).subscribe(res => {
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
      obj.thongsokythuat.maThongSo = this.thongso.maThongSo;
      console.log(this.thongso.maThongSo);
      this._api.post('/api/ThongSoKyThuats/update-tskt', obj.thongsokythuat).subscribe(res => {
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
