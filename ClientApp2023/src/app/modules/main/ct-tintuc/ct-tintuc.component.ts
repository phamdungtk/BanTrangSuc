import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-ct-tintuc',
  templateUrl: './ct-tintuc.component.html',
  styleUrls: ['./ct-tintuc.component.css']
})
export class CtTintucComponent extends BaseComponent implements OnInit,AfterViewInit {
  public item:any;
  public list_tin:any
  public danh_sach_danh_muc:any
  constructor(injector: Injector,private authenticationService: AuthenticationService) {
    super(injector);
  }
  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._api.get('/api/TinTucs/get-by-id/'+ id).subscribe(res => {
        this.item = res.tintuc      
        setTimeout(() => {
          this.loadScripts('assets/js/main.js');
        });
      });
    });
    this._api.get('/api/LoaiSanPhams/get-loai-sanpham').subscribe(res => {
      this.danh_sach_danh_muc = res;
      setTimeout(() => {
        this.loadScripts('');
      });
    });
    this._api.get('/api/TinTucs/Get-All').subscribe(res => {
      this.list_tin = res;  
      debugger 
    });
  }
  ngAfterViewInit() {
    // this.loadScripts('assets/js/main.js');
  }
  
}
