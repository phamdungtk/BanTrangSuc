import { Injectable } from '@angular/core';
declare var require: any;

declare var dateFormat: any;
import { ReturnServices, defaultTypeOrders } from './Services';
@Injectable({
  providedIn: 'root',
})


export class VNPayService {
    public payment = async (
      body: any,
      headers: any,
      connection: any,
      socket: any
    ): Promise<ReturnServices> => {
      try {
        var ipAddr =
          headers["x-forwarded-for"] ||
          connection.remoteAddress ||
          socket.remoteAddress ||
          connection.socket.remoteAddress;
        const transactions = body.amount * 100;
        const external_return_url =
          body.typeOrders == defaultTypeOrders.POINT
            ? `?price=${transactions}&idUser=${body.idUser}&point=${body.point}&typeOrders=${body.typeOrders}`
            : `?price=${transactions}&idUser=${body.idUser}&idPackageTemp=${body.idPackageTemp}&typeOrders=${body.typeOrders}&typeCart=${body.typeCart}`;

        var tmnCode = 'UYW9E73Q';
        var secretKey = 'JJFZZPZGGOTRMZLBLCGMZWGVXOOWEQQO';
        var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';           
        var returnUrl = 'vnp_ReturnUrl';

        var date = new Date();

        var createDate = dateFormat(date, "yyyymmddHHmmss");
        var orderId = dateFormat(date, "HHmmss");
        var bankCode = body.bankCode;

        var orderInfo = body.orderDescription;
        var orderType = body.orderType;
        var locale = body.language;
        if (locale === null || locale === "") {
          locale = "vn";
        }
        var currCode = "VND";
        var vnp_Params: any = {};
        vnp_Params["vnp_Version"] = "2";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_OrderType"] = orderType;
        vnp_Params["vnp_Amount"] = transactions;
        vnp_Params["vnp_ReturnUrl"] = returnUrl + external_return_url;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
          vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = this.sortObject(vnp_Params);

        var querystring = require("qs");
        var signData =
          secretKey + querystring.stringify(vnp_Params, { encode: false });

        // var sha256 = require("sha256");

        var secureHash = signData;

        vnp_Params["vnp_SecureHashType"] = "SHA256";
        vnp_Params["vnp_SecureHash"] = secureHash;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
        console.log("VNPAY URL: {0}", vnpUrl);
        return {
          message: "Successfully redirect link payment",
          success: true,
          data: { code: "00", url: vnpUrl },
        };
      } catch (error) {
        console.log(error);
        return { message: "An error occurred", success: false };
      }
    };
    private sortObject = (o: any) => {
        var sorted: any = {},
          key,
          a = [];
    
        for (key in o) {
          if (o.hasOwnProperty(key)) {
            a.push(key);
          }
        }
    
        a.sort();
    
        for (key = 0; key < a.length; key++) {
          sorted[a[key]] = o[a[key]];
        }
        return sorted;
    };
}