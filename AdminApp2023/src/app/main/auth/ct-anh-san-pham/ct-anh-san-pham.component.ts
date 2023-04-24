import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var $: any;

@Component({
  selector: 'app-ct-anh-san-pham',
  templateUrl: './ct-anh-san-pham.component.html',
  styleUrls: ['./ct-anh-san-pham.component.css']
})
export class CtAnhSanPhamComponent extends BaseComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  public msp: string = "";
  public list_ctanhsanpham: any;
  public list_sanpham: any;
  public isCreate = false;
  public ctanhsanpham: any;
  // public selectsp: any = 1;
  public frmCTAnhSanPham: FormGroup;
  public file: any;
  public showUpdateModal: any;
  public showUpdateModalCTA: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 2;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/CTAnhSanPhams/get-by-id/'+ id).subscribe(res => {
        this.list_ctanhsanpham = res;
        // console.log(this.list_ctanhsanpham );              
      });
    });
    this._api.get('/api/SanPhams/Get-All').subscribe(res => {
      this.list_sanpham = res;
      // console.log(this.list_sanpham);
      // this.selectsp = this.list_sanpham[0].maSanPham;
      // console.log(this.selectsp);
      
    });

  }
  // change_sp(sel_sp: any){
  //   this.selectsp = sel_sp;
  // }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmCTAnhSanPham = new FormGroup({
        'txt_masp': new FormControl('', []),
        'txt_anh': new FormControl('', []),
      });
    });
  }
  public openUpdateModal(maAnhChitiet: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/CTAnhSanPhams/get-by-id-anh/' + maAnhChitiet).subscribe(res => {
        this.ctanhsanpham = res.kq;
        console.log(this.ctanhsanpham);
  
        this.doneSetupForm = true;
        this.frmCTAnhSanPham = new FormGroup({
          'txt_masp': new FormControl(this.ctanhsanpham.maSanPham, []),
          'txt_anh': new FormControl(this.ctanhsanpham.anh, []),
        });
        this.msp = this.ctanhsanpham.maSanPham;
      });

    });
  }
 
  public onRemove(MaSanPham: any) {
    this._api.delete('/api/CTAnhSanPhams/delete-ctanhsp', MaSanPham).subscribe(res => {
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
    const controls = this.frmCTAnhSanPham.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmCTAnhSanPham.invalid) {
      return;
    }
    let obj: any = {};
    obj.anhsanpham = {
      maSanPham: vl.txt_masp,
      anh: vl.txt_anh,
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'sanpham', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.anhsanpham.anh = res.body.filePath;
            this._api.post('/api/CTAnhSanPhams/create-ctanhsp', obj.anhsanpham).subscribe(res => {
              if (res && res.data) {      
                        
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
        this._api.post('/api/CTAnhSanPhams/create-ctanhsp', obj.anhsanpham).subscribe(res => {
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
      obj.anhsanpham.maAnhChitiet = this.ctanhsanpham.maAnhChitiet;
      
      console.log(obj.anhsanpham.maAnhChitiet);
      
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'sanpham', this.file).subscribe((res: any) => 
        {
          if (res && res.body && res.body.filePath) {
            obj.anhsanpham.anh = res.body.filePath;
            debugger
            this._api.post('/api/CTAnhSanPhams/update-ctanhsp', obj.anhsanpham).subscribe(res => {
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
        this._api.post('/api/CTAnhSanPhams/update-ctanhsp', obj.anhsanpham).subscribe(res => {
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
