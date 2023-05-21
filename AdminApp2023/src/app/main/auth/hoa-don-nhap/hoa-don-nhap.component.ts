import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;
@Component({
  selector: 'app-hoa-don-nhap',
  templateUrl: './hoa-don-nhap.component.html',
  styleUrls: ['./hoa-don-nhap.component.css']
})
export class HoaDonNhapComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public list_hoadonnhap: any;
  public list_ctanhsanpham: any;
  public list_sanpham: any;
  public list_nguoidung: any;
  public list_nhacungcap: any;
  public sp: string = "";
  public nd: string = "";
  public ncc: string = "";
  public isCreate = false;
  public hoadonnhap: any;
  public ctanhsanpham: any;
  public frmHoaDonNhap: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public id :any;
  public page: any = 1;
  public pageSize: any = 5;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_sanpham': new FormControl('', []),
      'txt_nguoidung': new FormControl('', []),
      'txt_sohoadon': new FormControl('', []),
      'txt_nhacungcap': new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/HoaDonNhaps/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, sohoadon: this.frmSearch.value['txt_sohoadon'], nguoidung: this.frmSearch.value['txt_nguoidung'], sanpham: this.frmSearch.value['txt_sanpham'], nhacungcap: this.frmSearch.value['txt_nhacungcap']}).subscribe(res => {
      this.list_hoadonnhap = res.data;
      this.totalItem = res.totalItem;
      console.log(this.list_hoadonnhap);      
      setTimeout(() => {
        this.loadScripts(
        );
      });
    });
    this._api.get('/api/SanPhams/Get-All').subscribe(res => {
      this.list_sanpham = res;
      console.log(this.list_sanpham);
      
    });
    this._api.get('/api/Auth/get-admin').subscribe(res => {
      this.list_nguoidung = res;
      console.log(this.list_nguoidung);  
    });
    this._api.get('/api/NhaCungCaps/Get-All').subscribe(res => {
      this.list_nhacungcap = res;   
    });
  }
  public loadPage(page: any) {
    this._api.post('/api/HoaDonNhaps/search', {loc: this.loc,  page: page, pageSize: this.pageSize, sohoadon: this.frmSearch.value['txt_sohoadon'],nguoidung: this.frmSearch.value['txt_nguoidung'], sanpham: this.frmSearch.value['txt_sanpham'], nhacungcap: this.frmSearch.value['txt_nhacungcap']}).subscribe(res => {
      this.list_hoadonnhap = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/HoaDonNhaps/search', {  loc: this.loc, page: 1, pageSize: pageSize, sohoadon: this.frmSearch.value['txt_sohoadon'],nguoidung: this.frmSearch.value['txt_nguoidung'], sanpham: this.frmSearch.value['txt_sanpham'], nhacungcap: this.frmSearch.value['txt_nhacungcap']}).subscribe(res => {
      this.list_hoadonnhap = res.data;
      this.totalItem = res.totalItem;
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  // get sohoadon() {
  //   return this.frmHoaDonNhap.get('txt_sohoadon')!;
  // }
  // get sp() {
  //   return this.frmHoaDonNhap.get('txt_sanpham')!;
  // }
  // get soluong() {
  //   return this.frmHoaDonNhap.get('txt_soluong')!;
  // }
  // get dongianhap() {
  //   return this.frmHoaDonNhap.get('txt_dongianhap')!;
  // }
  // get gia() {
  //   return this.frmHoaDonNhap.get('txt_gia')!;
  // }
  // get phantram() {
  //   return this.frmHoaDonNhap.get('txt_phantram')!;
  // }
  // get tenthongso() {
  //   return this.frmHoaDonNhap.get('txt_tenthongso')!;
  // }
  // get txt_manhasanxuat() {
  //   return this.frmHoaDonNhap.get('txt_nhacungcap')!;
  // }
  // get mota() {
  //   return this.frmHoaDonNhap.get('txt_motan')!;
  // }
  // get tendonvitinh() {
  //   return this.frmHoaDonNhap.get('txt_tendonvitinh')!;
  // }
  // get motasanpham() {
  //   return this.frmHoaDonNhap.get('txt_motasanpham')!;
  // }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
      function getRandomId() {
        return Math.floor((Math.random()*6)+1);
      }
      this.id = (typeof this.id === 'undefined') ? getRandomId() : this.id;
      this.frmHoaDonNhap = new FormGroup({
        'txt_sohoadon': new FormControl('SHD' + this.id, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_ngaynhap': new FormControl('', [Validators.required]),
        'txt_soluong': new FormControl('', []),
        'txt_dongianhap': new FormControl('', []),
        'txt_manguoidung': new FormControl('', []),
        'txt_manhacungcap': new FormControl('', []),
        'txt_masanpham': new FormControl('', []),
      });
   
    });
  } 
  public openViewModal(maHoaDonNhap: any) {
    setTimeout(() => {
      debugger; 
      $('#ViewModal').modal('toggle');
      this._api.get('/api/HoaDonNhaps/get-by-id/' + maHoaDonNhap).subscribe(res => {         
        this.hoadonnhap = res.hoadonnhap;
        // console.log(res.sanpham); 
      });
    });
  }

  public openUpdateModal(maHoaDonNhap: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/HoaDonNhaps/get-by-id/' + maHoaDonNhap).subscribe(res => {
        this.hoadonnhap = res.hoadonnhap;
        this.doneSetupForm = true;
        this.frmHoaDonNhap = new FormGroup({
          'txt_sohoadon': new FormControl(this.hoadonnhap.soHoaDon, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_ngaynhap': new FormControl('', [Validators.required]),
          'txt_soluong': new FormControl(this.hoadonnhap.soLuong, []),
          'txt_dongianhap': new FormControl(this.hoadonnhap.donGiaNhap, []),
          'txt_manguoidung': new FormControl(this.hoadonnhap.maNguoiDung, []),
          'txt_manhacungcap': new FormControl(this.hoadonnhap.maNhaCungCap, []),
          'txt_masanpham': new FormControl(this.hoadonnhap.maSanPham, []),
        });
        this.sp = this.hoadonnhap.maSanPham;
        this.nd = this.hoadonnhap.maNguoiDung;
        this.ncc = this.hoadonnhap.maNhaCungCap;
        this.frmHoaDonNhap.get('txt_ngaynhap')?.patchValue(this.formatDate(new Date(this.hoadonnhap.ngayNhap) ));
      });
    });
  }

  public onRemove(maHoaDonNhap: any) {
    this._api.delete('/api/HoaDonNhaps/delete-hoadonnhap', maHoaDonNhap).subscribe(res => {
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
    const controls = this.frmHoaDonNhap.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmHoaDonNhap.invalid) {
      return;
    }
    let obj: any = {};
    obj.hoadonnhap = {
      sohoadon: vl.txt_sohoadon,
      ngayNhap: vl.txt_ngaynhap,
      maNhaCungCap: vl.txt_manhacungcap,
      maNguoiDung: vl.txt_manguoidung,
    }

    obj.chitiethoadonnhap = {
      maSanPham:vl.txt_masanpham,
      soLuong: vl.txt_soluong,
      donGiaNhap: vl.txt_dongianhap,
    }
    if (this.isCreate) { debugger
      this._api.post('/api/HoaDonNhaps/create-hoadonnhap', obj).subscribe(res => {
        if (res && res.data) {       
          console.log(res);
          alert('Thêm dữ liệu thành công');
          this.LoadData();
          this.closeModal();
        } else {
          alert('Có lỗi')
        }
      });
    } else {
      obj.hoadonnhap.maHoaDonNhap = this.hoadonnhap.maHoaDonNhap;
      obj.chitiethoadonnhap.maHoaDonNhap = this.hoadonnhap.maHoaDonNhap;
      console.log(this.hoadonnhap.maHoaDonNhap);
      debugger
      this._api.post('/api/HoaDonNhaps/update-hoadonnhap', obj).subscribe(res => {
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