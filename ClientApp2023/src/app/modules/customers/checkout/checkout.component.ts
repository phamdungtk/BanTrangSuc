import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/common/base-component';

import { OrderInfo } from '../model/OrderInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReturnServices, defaultTypeOrders } from 'src/app/core/services/Services';
declare var require: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent extends BaseComponent implements OnInit {
  public frmKhach: FormGroup;
  public list_items: any;
  public tTong: any;
  public tTongGiamGia: any;
  constructor(injector: Injector,private _router: Router, private http: HttpClient) {
    super(injector);
  }
  applyDiscount(gia: number, phanTram: number): number {
    let finalPrice: number = gia - gia * (phanTram / 100);
    return finalPrice;
  }
  // public ThanhToan () {
  //           var tmnCode = 'UYW9E73Q';
  //           var secretKey = 'JJFZZPZGGOTRMZLBLCGMZWGVXOOWEQQO';
  //           var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';           
  //           var returnUrl = 'http://localhost:4200/customers/check-out';

  //           var order: any  = new OrderInfo();
           
  //           order.createDate = "2023-05-09 17:04:55";
  //           order.orderId = " 17:04:55";
  //           order.Amount = 10000;
  //           order.OrderDescription = "VIP1";
  //           order.BankCode = "NCB";
  //           order.Status = 0;
  //           order.locale = "vn";
  //           order.currCode = "VND";
  //           var vnp_Params: any = {};
  //           vnp_Params["vnp_Version"] = "2";
  //           vnp_Params["vnp_Command"] = "pay";
  //           vnp_Params["vnp_TmnCode"] = tmnCode;
  //           // vnp_Params['vnp_Merchant'] = ''
  //           vnp_Params["vnp_Locale"] = order.locale;
  //           vnp_Params["vnp_CurrCode"] = order.currCode;
  //           vnp_Params["vnp_TxnRef"] = order.orderId;
  //           vnp_Params["vnp_OrderInfo"] = order.OrderDescription;
  //           // vnp_Params["vnp_OrderType"] = orderType;
  //           vnp_Params["vnp_Amount"] = order.Amount * 100;
  //           vnp_Params["vnp_ReturnUrl"] = returnUrl;
  //           vnp_Params["vnp_IpAddr"] = "192.168.1.7";
  //           vnp_Params["vnp_CreateDate"] = order.createDate;
  //           var querystring = require("qs");
  //           vnp_Params = this.sortObject(vnp_Params);

  //           var querystring = require("qs");
  //           var signData =
  //             secretKey + querystring.stringify(vnp_Params, { encode: false });

  //           // var sha256 = require("sha256");

  //           var secureHash = signData;

  //           vnp_Params["vnp_SecureHashType"] = "SHA256";
  //           vnp_Params["vnp_SecureHash"] = secureHash;
  //           vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
            
  //           console.log("VNPAY URL: {0}", vnpUrl);       
  //           return (vnpUrl);                                                                
  // }
  // private sortObject = (o: any) => {
  //   var sorted: any = {},
  //     key,
  //     a = [];

  //   for (key in o) {
  //     if (o.hasOwnProperty(key)) {
  //       a.push(key);
  //     }
  //   }

  //   a.sort();

  //   for (key = 0; key < a.length; key++) {
  //     sorted[a[key]] = o[a[key]];
  //   }
  //   return sorted;
  // };
  ngOnInit(): void {

    this.list_items = JSON.parse(localStorage.getItem('cart') || '[]');
    this.tTong = this.list_items.reduce((sum: any, x: any) => sum + x.gia * x.quantity, 0);
    this.tTongGiamGia = this.list_items.reduce((sum:any, x:any) => sum +  (x.gia - x.gia * (x.phanTram / 100)) * x.quantity, 0);
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
        giaMua: x.gia - x.gia * (x.phanTram / 100)
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
