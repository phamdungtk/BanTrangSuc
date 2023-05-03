import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-chi-tiet-nhom',
  templateUrl: './chi-tiet-nhom.component.html',
  styleUrls: ['./chi-tiet-nhom.component.css']
})
export class ChiTietNhomComponent extends BaseComponent implements OnInit, AfterViewInit {

  public list_chitietnhom: any;
  public list_sanpham: any;
  public list_nhomsanpham: any;
  public item: any;
  public sp: string = "";
  public nsp: string = "";
  public isCreate = false;
  public chitietnhom: any;
  public ctanhsanpham: any;
  public frmChiTietNhom: FormGroup;
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
      // 'txt_tennhom': new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.LoadData();
  }
  public LoadData() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/ChiTietNhoms/get-by-id/'+ id).subscribe(res => {
        this.list_chitietnhom = res;
        console.log(this.list_chitietnhom );   
        setTimeout(() => {
          this.loadScripts('assets/js/scripts/pages/dashboard.js','assets/dist/js/demo.js','assets/dist/js/adminlte.min.js' );
        }); 
      });
    });
    this._api.get('/api/NhomSanPhams/Get-All').subscribe(res => {
      this.list_nhomsanpham = res;
    });
    this._api.get('/api/SanPhams/Get-All').subscribe(res => {
      this.list_sanpham = res;
    });
  }
  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmChiTietNhom = new FormGroup({
        'txt_manhomsanpham': new FormControl('', [Validators.required]),
        'txt_masanpham': new FormControl('', [Validators.required]),
      });
      
    });
  } 
  public openUpdateModal(MaChiTietNhom: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/ChiTietNhoms/get-by-id/' + MaChiTietNhom).subscribe(res => {
        this.chitietnhom = res.chitietnhom;
        this.doneSetupForm = true;
        this.frmChiTietNhom = new FormGroup({
          'txt_manhomsanpham': new FormControl(this.chitietnhom.maNhomSanPham, [Validators.required]),
          'txt_masanpham': new FormControl(this.chitietnhom.maSanPham, [Validators.required]),
        });
        this.sp = this.chitietnhom.maSanPham;
        this.nsp = this.chitietnhom.maNhomSanPham;
      });
    });
  }

  public onRemove(MaChiTietNhom: any) {
    this._api.delete('/api/ChiTietNhoms/delete-chitietnhom', MaChiTietNhom).subscribe(res => {
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
    const controls = this.frmChiTietNhom.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmChiTietNhom.invalid) {
      return;
    }
    let obj: any = {};
    obj.chitietnhom = {
      maSanPham: vl.txt_masanpham,
      maNhomSanPham: vl.txt_manhomsanpham
    }
    if (this.isCreate) { debugger
      this._api.post('/api/ChiTietNhoms/create-chitietnhom', obj.chitietnhom).subscribe(res => {
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
      obj.chitietnhom.MaChiTietNhom = this.chitietnhom.maChiTietNhom;

      console.log(this.chitietnhom.machitietnhom);
      debugger
      this._api.post('/api/ChiTietNhoms/update-chitietnhom', obj.chitietnhom).subscribe(res => {
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