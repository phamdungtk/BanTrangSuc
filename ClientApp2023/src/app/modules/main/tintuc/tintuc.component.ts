import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';
import { CartService } from 'src/app/core/services/cart.service';
import { SendService } from 'src/app/core/services/send.service';

@Component({
  selector: 'app-tintuc',
  templateUrl: './tintuc.component.html',
  styleUrls: ['./tintuc.component.css']
})
export class TintucComponent extends BaseComponent implements OnInit {
  public loc:any;
  public page: any = 1;
  public id: any;
  public pageSize: any = 6;
  public list_item: any;
  public totalItem: any;
  public danh_sach_san_pham:any;
  public danh_sach_danh_muc:any;
  constructor(injector: Injector,) {
    super(injector);
  }

  ngOnInit(): void {
    this.loc = localStorage.getItem('loc') || '';
    this._api.post('/api/TinTucs/search', { loc: this.loc, page: this.page, pageSize: this.pageSize}).subscribe(res => {
      this.list_item = res.data;
      this.totalItem = res.totalItem;
      console.log(res.data); 
      setTimeout(() => {
        this.loadScripts('assets/js/main.js');
      });
    });     
  }
  public loadPage(page: any) {
    this._api.post('/api/TinTucs/search', {loc: this.loc,  page: page, pageSize: this.pageSize }).subscribe(res => {
      this.list_item = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }
 
  public loadData(pageSize:any) {
   this.pageSize = pageSize;
    this._api.post('/api/TinTucs/search', { loc: this.loc, page: 1, pageSize: pageSize}).subscribe(res => {
      this.list_item = res.data;
      this.totalItem = res.totalItem;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
  }

  setDieuKienLoc(loc: any) {
    this.loc = loc;
    localStorage.setItem('loc',loc); 
    this.loadData(this.pageSize);
  }
}