import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;
@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.css']
})
export class SanPhamComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public list_sanpham: any;
  public list_loaisp: any;
  public list_donvitinh: any;
  public list_nhasanxuat: any;
  public selectloai: any = 1;
  public selectdonvitinh: any = 1;
  public selectnhasanxuat: any = 1;
  public isCreate = false;
  public sanpham: any;
  public frmSanPham: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 2;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_tensanpham': new FormControl('', []),
      'txt_tendanhmuc': new FormControl('', []),
      'txt_tennhasanxuat': new FormControl('', []),
    });
  }

  ngOnInit(): void {
    // this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/SanPhams/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc'], tennhasanxuat: this.frmSearch.value['txt_tennhasanxuat']}).subscribe(res => {
      this.list_sanpham = res.data;
      this.totalItem = res.totalItem;
      // console.log(res.data);
      // console.log(res.totalItem);   
      setTimeout(() => {
        this.loadScripts(
        );
      });
    });
    this._api.get('/api/LoaiSanPhams/get-loai-sanpham').subscribe(res => {
      this.list_loaisp = res;
      this.selectloai = this.list_loaisp[0].maDanhMuc;
      console.log(this.selectloai);
      
    });
    this._api.get('/api/DonViTinhs/Get-All').subscribe(res => {
      this.list_donvitinh = res;
      this.selectdonvitinh = this.list_donvitinh[0].maDonViTinh;
      console.log(this.selectdonvitinh);      
    });
    this._api.get('/api/NhaSanXuats/Get-All').subscribe(res => {
      this.list_nhasanxuat = res;
      this.selectnhasanxuat = this.list_nhasanxuat[0].maNhaSanXuat;
      console.log(this.selectnhasanxuat);     
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/SanPhams/search', {loc: this.loc,  page: page, pageSize: this.pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc'], tennhasanxuat: this.frmSearch.value['txt_tennhasanxuat']}).subscribe(res => {
      this.list_sanpham = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/SanPhams/search', {  loc: this.loc, page: 1, pageSize: pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc'], tennhasanxuat: this.frmSearch.value['txt_tennhasanxuat']}).subscribe(res => {
      this.list_sanpham = res.data;
      this.totalItem = res.totalItem;
      // console.log(res.data);
      // console.log(res.totalItem);
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  } 
  change_dm(sel_dm: any){
    this.selectloai= sel_dm;
  }
  change_dvt(sel_dvt: any){

    this.selectdonvitinh = sel_dvt;
  }
  change_nsx(sel_nsx: any){

    this.selectnhasanxuat = sel_nsx;
  }
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  get tensanpham() {
    return this.frmSanPham.get('txt_tensanpham')!;
  }
  get tendanhmuc() {
    return this.frmSanPham.get('txt_tendanhmuc')!;
  }
  get soluong() {
    return this.frmSanPham.get('txt_soluong')!;
  }
  get dongianhap() {
    return this.frmSanPham.get('txt_dongianhap')!;
  }
  get gia() {
    return this.frmSanPham.get('txt_gia')!;
  }
  get phantram() {
    return this.frmSanPham.get('txt_phantram')!;
  }
  get tenthongso() {
    return this.frmSanPham.get('txt_tenthongso')!;
  }
  get txt_manhasanxuat() {
    return this.frmSanPham.get('txt_tennhasanxuat')!;
  }
  get mota() {
    return this.frmSanPham.get('txt_motan')!;
  }
  get tendonvitinh() {
    return this.frmSanPham.get('txt_tendonvitinh')!;
  }
  get motasanpham() {
    return this.frmSanPham.get('txt_motasanpham')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmSanPham = new FormGroup({
        'txt_tensanpham': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_madanhmuc': new FormControl('', []),
        'txt_motasanpham': new FormControl('', []),
        'txt_anhdaidien': new FormControl('', []),
        'txt_manhasanxuat': new FormControl('', []),
        'txt_madonvitinh': new FormControl('', []),
        'txt_gia': new FormControl('', []),
        'txt_phantram': new FormControl('', []),
        'txt_tenthongso': new FormControl('', []),
        'txt_mota': new FormControl('', []),
      });

    });
  }
  public openViewModal(MaSanPham: any) {
    setTimeout(() => {
      debugger; 
      $('#ViewModal').modal('toggle');
      this._api.get('/api/SanPhams/get-by-id/' + MaSanPham).subscribe(res => {
          
        this.sanpham = res.sanpham;
        // console.log(res.sanpham); 
    
      });
    });
  }

  public openUpdateModal(MaSanPham: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/SanPhams/get-by-id/' + MaSanPham).subscribe(res => {
        this.sanpham = res.sanpham;
        this.doneSetupForm = true;
        this.frmSanPham = new FormGroup({
          'txt_tensanpham': new FormControl(this.sanpham.tenSanPham, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_madanhmuc': new FormControl(this.sanpham.maDanhMuc, []),
          'txt_motasanpham': new FormControl(this.sanpham.moTaSanPham, []),
          'txt_anhdaidien': new FormControl(this.sanpham.anhDaiDien, []),
          'txt_manhasanxuat': new FormControl(this.sanpham.maNhaSanXuat, []),
          'txt_madonvitinh': new FormControl(this.sanpham.maDonViTinh, []),        
          'txt_gia': new FormControl(this.sanpham.gia, []),
          'txt_phantram': new FormControl(this.sanpham.phanTram, []),
          'txt_tenthongso': new FormControl(this.sanpham.tenThongSo, []),
          'txt_mota': new FormControl(this.sanpham.mota, []),
        });
      });
    });
  }

  public onRemove(MaSanPham: any) {
    this._api.delete('/api/SanPhams/delete-sanpham', MaSanPham).subscribe(res => {
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
    const controls = this.frmSanPham.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmSanPham.invalid) {
      return;
    }
    let obj: any = {};
    obj.sanpham = {
      tenSanPham: vl.txt_tensanpham,
      // maDanhMuc: vl.txt_madanhmuc,
      maDanhMuc:parseInt(this.selectloai),
      moTaSanPham: vl.txt_motasanpham,
      anhDaiDien: vl.txt_anhdaidien,
      maNhaSanXuat:parseInt(this.selectnhasanxuat),
      maDonViTinh:parseInt(this.selectdonvitinh),
    }
    // obj.chitietanhsanpham = {
    //   anh: vl.txt_anh,

    // }
    obj.giasapham = {
      gia: vl.txt_gia,
    }
    obj.giamgia = {
      phanTram: vl.txt_phantram,
    }
    obj.thongsokythuat = {
      tenThongSo: vl.txt_tenthongso,
      moTa: vl.txt_mota
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'sanpham', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.sanpham.anhDaiDien = res.body.filePath;
            this._api.post('/api/SanPhams/create-sanpham', obj).subscribe(res => {
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
        this._api.post('/api/SanPhams/create-sanpham', obj).subscribe(res => {
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
      obj.sanpham.MaSanPham = this.sanpham.maSanPham;
      // obj.chitietanhsanpham.MaSanPham = this.sanpham.maSanPham;
      obj.giasapham.MaSanPham = this.sanpham.maSanPham;
      obj.giamgia.MaSanPham = this.sanpham.maSanPham;
      obj.thongsokythuat.MaSanPham = this.sanpham.maSanPham;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'auth', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.sanpham.AnhDaiDien = res.body.filePath;
            this._api.post('/api/SanPhams/update-sanpham', obj).subscribe(res => {
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
        this._api.post('/api/SanPhams/update-sanpham', obj).subscribe(res => {
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
