import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;
import * as XLSX from 'xlsx';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-san-pham',
  templateUrl: './san-pham.component.html',
  styleUrls: ['./san-pham.component.css']
})
export class SanPhamComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public mdm: string = "";
  public nsx: string = "";
  public mdvt: string = "";
  public list_sanpham: any;
  public list_ctanhsanpham: any;
  public list_loaisp: any;
  public list_donvitinh: any;
  public list_nhasanxuat: any;
  public isCreate = false;
  public sanpham: any;
  public ctanhsanpham: any;
  public frmSanPham: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 10;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_tensanpham': new FormControl('', [Validators.required]),
      'txt_tendanhmuc': new FormControl('', [Validators.required]),
      'txt_tennhasanxuat': new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/SanPhams/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tensanpham: this.frmSearch.value['txt_tensanpham'], tendanhmuc: this.frmSearch.value['txt_tendanhmuc'], tennhasanxuat: this.frmSearch.value['txt_tennhasanxuat']}).subscribe(res => {
      this.list_sanpham = res.data;
      this.totalItem = res.totalItem;
    });
    this._api.get('/api/LoaiSanPhams/Get-All').subscribe(res => {
      this.list_loaisp = res;
    });
    this._api.get('/api/DonViTinhs/Get-All').subscribe(res => {
      this.list_donvitinh = res;   
    });
    this._api.get('/api/NhaSanXuats/Get-All').subscribe(res => {
      this.list_nhasanxuat = res;    
    });
  }
  

  applyDiscount(gia: number, phanTram: number): number {
    let finalPrice: number = gia - gia * (phanTram / 100);
    return finalPrice;
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
    });
  } 
  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
  
  fileName= 'san-pham.xlsx';
  public exportExcel(): void
  {
    /* chuyển vào đây id bảng*/
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* tạo sổ làm việc và thêm trang tính*/
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }
  public convertToPDF() {
    var data = document.getElementById('excel-table') as HTMLElement;
    var pdf = new jspdf('p', 'pt', 'a4');
  
    // Thiết lập kiểu chữ
    pdf.setFont('Helvetica-Bold');
    pdf.setFontSize(14);
  
    // Thiết lập bảng màu và màu chữ
    var primaryColor = [67, 181, 129];
    var secondaryColor = [245, 248, 250];
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  
    var imgWidth = pdf.internal.pageSize.getWidth() - 40; // Thêm khoảng cách để tránh tràn bảng
    var imgHeight = data.clientHeight * imgWidth / data.clientWidth;
    html2canvas(data, {scale: 2}).then(canvas => { // Tăng độ phân giải hình ảnh
      var imgData = canvas.toDataURL('image/png');
  
      var imgRatio = imgHeight / imgWidth;
      var pageHeight = pdf.internal.pageSize.height - 50; // Trừ đi khoảng cách để tránh tràn bảng
      var position = 0;
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 2, 110, imgWidth, imgHeight, undefined, 'FAST');
        position += pageHeight;
        if (position < imgHeight) {
          pdf.addPage();
        }
      }
  
      // Định dạng và in tên sản phẩm và ngày giờ
      pdf.setFont('Quicksand', 'bold');
      pdf.setFontSize(26);
      pdf.setTextColor(0, 0, 0);
      pdf.text('San Pham', pdf.internal.pageSize.width / 2, 70, {align: 'center'});
      pdf.setFont('Helvetica');
      pdf.setFontSize(14); 
      pdf.setTextColor(0, 0, 0);
      pdf.text('Ngay Gio: ' + new Date().toLocaleString('vi'), pdf.internal.pageSize.width / 2, 90, {align: 'center'});
  
      pdf.save('san-pham.pdf');
    });
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
  get thoigianbatdau() {
    return this.frmSanPham.get('txt_thoigianbatdau')!;
  } get thoigianketthuc() {
    return this.frmSanPham.get('txt_thoigianketthuc')!;
  }
  // get tenthongso() {
  //   return this.frmSanPham.get('txt_tenthongso')!;
  // }
  get txt_manhasanxuat() {
    return this.frmSanPham.get('txt_tennhasanxuat')!;
  }
  // get mota() {
  //   return this.frmSanPham.get('txt_mota')!;
  // }
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
        'txt_madanhmuc': new FormControl('', [Validators.required]),
        'txt_motasanpham': new FormControl('', [Validators.required]),
        'txt_anhdaidien': new FormControl('', [Validators.required]),
        'txt_manhasanxuat': new FormControl('', [Validators.required]),
        'txt_madonvitinh': new FormControl('', [Validators.required]),
        'txt_gia': new FormControl('', [Validators.required]),
        'txt_phantram': new FormControl('', [Validators.required]),
        'txt_thoigianbatdau': new FormControl('', [Validators.required]),
        'txt_thoigianketthuc': new FormControl('', [Validators.required]),
      });
    });
  }
  public openViewModal(MaSanPham: any) {
    setTimeout(() => {
      debugger; 
      $('#ViewModal').modal('toggle');
      this._api.get('/api/SanPhams/get-by-id/' + MaSanPham).subscribe(res => {      
        this.sanpham = res.sanpham;
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
          'txt_madanhmuc': new FormControl('', [Validators.required]),
          'txt_motasanpham': new FormControl(this.sanpham.moTaSanPham, [Validators.required]),
          'txt_anhdaidien': new FormControl(this.sanpham.anhDaiDien, [Validators.required]),
          'txt_manhasanxuat': new FormControl('', [Validators.required]),
          'txt_madonvitinh': new FormControl('', [Validators.required]),        
          'txt_gia': new FormControl(this.sanpham.gia, [Validators.required]),
          'txt_phantram': new FormControl(this.sanpham.phanTram, [Validators.required]),
          'txt_thoigianbatdau': new FormControl('', [Validators.required]),
          'txt_thoigianketthuc': new FormControl('', [Validators.required]),
        });     
        this.nsx = this.sanpham.maNhaSanXuat;
        this.mdm = this.sanpham.maDanhMuc;
        this.mdvt = this.sanpham.maDonViTinh;
        this.frmSanPham.get('txt_thoigianbatdau')?.patchValue(this.formatDate(new Date(this.sanpham.thoiGianBatDau)))
        this.frmSanPham.get('txt_thoigianketthuc')?.patchValue(this.formatDate(new Date(this.sanpham.thoiGianKetThuc)))
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
      maDanhMuc:vl.txt_madanhmuc,
      moTaSanPham: vl.txt_motasanpham,
      anhDaiDien: vl.txt_anhdaidien,
      maNhaSanXuat:vl.txt_manhasanxuat,
      maDonViTinh:vl.txt_madonvitinh,
    }

    obj.giasapham = {
      gia: vl.txt_gia,
    }
    obj.giamgia = {
      phanTram: vl.txt_phantram,
      thoiGianBatDau: vl.txt_thoigianbatdau,
      thoiGianKetThuc: vl.txt_thoigianketthuc,
    }
    // obj.thongsokythuat = {
    //   tenThongSo: vl.txt_tenthongso,
    //   moTa: vl.txt_mota
    // }
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
      obj.giasapham.MaSanPham = this.sanpham.maSanPham;
      obj.giamgia.MaSanPham = this.sanpham.maSanPham;
      // obj.thongsokythuat.MaSanPham = this.sanpham.maSanPham;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'sanpham', this.file).subscribe((res: any) => {
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
