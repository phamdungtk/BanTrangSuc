import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
declare var $: any;

@Component({
  selector: 'app-tin-tuc',
  templateUrl: './tin-tuc.component.html',
  styleUrls: ['./tin-tuc.component.css']
})
export class TinTucComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public mdm: string = "";
  public nsx: string = "";
  public mdvt: string = "";
  public list_tintuc: any;
  public list_ctanhsanpham: any;
  public list_loaisp: any;
  public list_donvitinh: any;
  public list_nhasanxuat: any;
  public isCreate = false;
  public tintuc: any;
  public ctanhsanpham: any;
  public frmTinTuc: FormGroup;
  public frmSearch: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 5;
  public totalItem: any;
  public user : any;
  constructor(injector: Injector,private authenticationService: AuthenticationService) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_tieude': new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._api.post('/api/TinTucs/search', {  loc: this.loc, page: this.page, pageSize: this.pageSize, tieu_de: this.frmSearch.value['txt_tieude'],}).subscribe(res => {
      this.list_tintuc = res.data;
      this.totalItem = res.totalItem;
    });

  }
  public loadPage(page: any) {
    this._api.post('/api/TinTucs/search', {loc: this.loc,  page: page, pageSize: this.pageSize, tieu_de: this.frmSearch.value['txt_tieude'],}).subscribe(res => {
      this.list_tintuc = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/TinTucs/search', {  loc: this.loc, page: 1, pageSize: pageSize, tieu_de: this.frmSearch.value['txt_tieude'],}).subscribe(res => {
      this.list_tintuc = res.data;
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
      this.frmTinTuc = new FormGroup({
        'txt_tieude': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(1250)]),
        'txt_manguoidung': new FormControl(this.user.maNguoiDung),
        'txt_noidung': new FormControl('', [Validators.required]),
        'txt_anhtintuc': new FormControl('', [Validators.required]),  
      });
    });
  }
  public openViewModal(MaTinTuc: any) {
    setTimeout(() => {
      debugger; 
      $('#ViewModal').modal('toggle');
      this._api.get('/api/TinTucs/get-by-id/' + MaTinTuc).subscribe(res => {      
        this.tintuc = res.tintuc;
      });
    });
  }
  public openUpdateModal(MaTinTuc: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/TinTucs/get-by-id/' + MaTinTuc).subscribe(res => {
        this.tintuc = res.tintuc;
        this.doneSetupForm = true;
        this.frmTinTuc = new FormGroup({
          'txt_tieude': new FormControl(this.tintuc.tieuDe, [Validators.required, Validators.minLength(3), Validators.maxLength(1250)]),
          'txt_manguoidung': new FormControl(this.user.maNguoiDung),
          'txt_noidung': new FormControl(this.tintuc.noiDung, [Validators.required]),
          'txt_anhtintuc': new FormControl(this.tintuc.anhTinTuc, [Validators.required]),
        });
      }); 
    });
  }
  public onRemove(MaSanPham: any) {
    this._api.delete('/api/TinTucs/delete-tintuc', MaSanPham).subscribe(res => {
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
    const controls = this.frmTinTuc.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmTinTuc.invalid) {
      return;
    }
    let obj: any = {};
    obj.tintuc = {
      tieuDe: vl.txt_tieude,
      maNguoiDung:vl.txt_manguoidung,
      noiDung: vl.txt_noidung,
      anhTinTuc: vl.txt_anhtintuc,
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'tintuc', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.tintuc.anhTinTuc = res.body.filePath;
            this._api.post('/api/TinTucs/create-tinTuc', obj.tintuc).subscribe(res => {
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
        this._api.post('/api/TinTucs/create-tintuc', obj.tintuc).subscribe(res => {
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
      obj.tintuc.MaTinTuc = this.tintuc.maTinTuc;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'tintuc', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.tintuc.anhTinTuc = res.body.filePath;
            this._api.post('/api/TinTucs/update-tintuc', obj).subscribe(res => {
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
        this._api.post('/api/TinTucs/update-tintuc', obj.tintuc).subscribe(res => {
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
