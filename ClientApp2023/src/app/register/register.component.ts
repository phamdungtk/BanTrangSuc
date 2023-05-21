import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import MatchValidation from './../core/helpers/must-match.validator';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseComponent implements OnInit, AfterViewInit {
  public list_users: any;
  public isCreate = false;
  public user: any;
  public id: any;
  public frmUser: FormGroup;
  public frmSearch: FormGroup;
  public loaiQuyen: string = 'User';
  public file: any;
  public showUpdateModal: any;
  public doneSetupForm: any;
  public loc:any;
  public page: any = 1;
  public pageSize: any = 5;
  public totalItem: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this.frmUser = new FormGroup({
      'txt_hoten': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      'txt_ngaysinh': new FormControl('', [Validators.required]),
      'txt_gioitinh': new FormControl('Nam', [Validators.required]),
      'txt_diachi': new FormControl('', []),
      'txt_email': new FormControl('', [Validators.email]),
      'txt_dienthoai': new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      'txt_taikhoan': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      'txt_matkhau': new FormControl('', []),
      'txt_nhaplai_matkhau': new FormControl('', [Validators.required]),
      'txt_loaiquyen': new FormControl('', []),
      'txt_anh': new FormControl('', []),
    }, {
      validators: [MatchValidation.match('txt_matkhau', 'txt_nhaplai_matkhau')]
    });
    // this._route.params.subscribe(params => {
    //   this.id = params['id'];
    //   this._api.get('/api/Auth/get-by-id/' + this.id).subscribe(res => {
    //   this.user = res.user;
    //   console.log(this.user);
      
    //   this.doneSetupForm = true;
    //   this.frmUser = new FormGroup({
    //     'txt_hoten': new FormControl(this.user.hoTen, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
    //     'txt_ngaysinh': new FormControl('', [Validators.required]),
    //     'txt_gioitinh': new FormControl(this.user.gioiTinh, [Validators.required]),
    //     'txt_diachi': new FormControl(this.user.diaChi, []),
    //     'txt_email': new FormControl(this.user.email, [Validators.email]),
    //     'txt_dienthoai': new FormControl(this.user.dienThoai, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    //     'txt_taikhoan': new FormControl(this.user.taiKhoan1, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    //     'txt_matkhau': new FormControl(this.user.matKhau, []),
    //     'txt_nhaplai_matkhau': new FormControl(this.user.matKhau, [Validators.required]),
    //     'txt_loaiquyen': new FormControl('', []),
    //     'txt_anh': new FormControl(this.user.anhDaiDien, []),
    //   }, {
    //     validators: [MatchValidation.match('txt_matkhau', 'txt_nhaplai_matkhau')]
    //   });
    //   this.loaiQuyen = this.user.loaiQuyen;
    //   this.frmUser.get('txt_ngaysinh')?.patchValue(this.formatDate(new Date(this.user.ngaySinh)
    //   ));
    // });
    // });
   
  }
  
  get hoten() {
    return this.frmUser.get('txt_hoten')!;
  }
  get taikhoan() {
    return this.frmUser.get('txt_taikhoan')!;
  }
  get loaiquyen() {
    return this.frmUser.get('txt_loaiquyen')!;
  }
  get email() {
    return this.frmUser.get('txt_email')!;
  }
  get dienthoai() {
    return this.frmUser.get('txt_dienthoai')!;
  }
  get ngaysinh() {
    return this.frmUser.get('txt_ngaysinh')!;
  }

  get matkhau() {
    return this.frmUser.get('txt_matkhau')!;
  }

  get nhaplaimatkhau() {
    return this.frmUser.get('txt_nhaplai_matkhau')!;
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
    const controls = this.frmUser.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmUser.invalid) {
      return;
    }
    let obj: any = {};
    obj.nguoidung = {
      HoTen: vl.txt_hoten,
      NgaySinh: vl.txt_ngaysinh,
      GioiTinh: vl.txt_gioitinh,
      DiaChi: vl.txt_diachi,
      Email: vl.txt_email,
      DienThoai: vl.txt_dienthoai,
      AnhDaiDien: vl.txt_anh,
      TrangThai: true
    }
    obj.taikhoan = {
      TaiKhoan1: vl.txt_taikhoan,
      MatKhau: vl.txt_matkhau,
      Email: vl.txt_email,
      DienThoai: vl.txt_dienthoai,
      LoaiQuyen: "User",
      TrangThai: true
    }
    if (this.file) {
          this._api.uploadFileSingle('/api/UploadClients/upload-single', 'auth', this.file).subscribe((res: any) => {
            if (res && res.body && res.body.filePath) {
              obj.nguoidung.AnhDaiDien = res.body.filePath;
              this._api.post('/api/Auth/create-auth', obj).subscribe(res => {
                if (res && res.data) {
                  alert('Thêm dữ liệu thành công');
                } else {
                  alert('Có lỗi')
                }
              });
            }
          });
    } 
    // obj.nguoidung.MaNguoiDung = this.user.this.id;
    // obj.taikhoan.MaNguoiDung = this.user.this.id;
    // debugger
    // if (this.file) {
    //     this._api.uploadFileSingle('/api/UploadClients/upload-single', 'auth', this.file).subscribe((res: any) => {
    //       if (res && res.body && res.body.filePath) {
    //         obj.nguoidung.AnhDaiDien = res.body.filePath;
    //         this._api.post('/api/Auth/update-auth', obj).subscribe(res => {
    //           if (res && res.data) {
    //             alert('Cập nhật dữ liệu thành công');
    //           } else {
    //             alert('Có lỗi')
    //           }
    //         });
    //       }
    //     });
    // } 
  }
}
