import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent extends BaseComponent implements OnInit {
  public frmKhach: FormGroup;
  public list_items: any;
  public tTong: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.list_items = JSON.parse(localStorage.getItem('cart') || '[]');
    this.tTong = this.list_items.reduce((sum: any, x: any) => sum + x.gia * x.quantity, 0);
    this.frmKhach = new FormGroup({
      'txt_hoten': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'txt_sdt': new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      'txt_email': new FormControl('', [Validators.email]),
      'txt_diachi': new FormControl('', [Validators.required]),
      'txt_ghichu': new FormControl('')
    });
    setTimeout(() => {
      this.loadScripts('assets/js/main.js');
    });
  }
  get hoten() {
    return this.frmKhach.get('txt_hoten')!;
  }
  get sodienthoai() {
    return this.frmKhach.get('txt_sdt')!;
  }
  get email() {
    return this.frmKhach.get('txt_email')!;
  }
  get diachi() {
    return this.frmKhach.get('txt_diachi')!;
  }
  public onSubmit(val: any) {
    if (this.frmKhach.invalid) {
      return;
    }
    debugger;
    let obj: any = {};
    obj.khach = {
      tenKhachHang: val.txt_hoten,
      diaChi: val.txt_diachi,
      soDienThoai: val.txt_sdt,
      email: val.txt_email
    };
    obj.donhang = [];
    this.list_items.forEach((x: any) => {
      obj.donhang.push({
        maSanPham: x.maSanPham,
        soLuong: x.quantity,
        giaMua: x.gia
      });
    });
    console.log(obj);
    debugger;
    this._api.post('/api/DonHangs/create-giohang', obj).subscribe(res => {
      console.log(obj);
      debugger;
      if (res && res.data) {
        alert('Thêm dữ liệu thành công')
      } else {
        alert('Có lỗi')
      }
      if (confirm("Đặt hàng thành công hàng!")) {
        localStorage.setItem('cart','');
        this.list_items = null;
        this.tTong = 0;
      }
    });
  }

}
