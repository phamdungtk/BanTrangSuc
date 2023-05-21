import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../core/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public frmLogin: FormGroup;
  public submitted = false;
  public loading = false;
  public returnUrl: string;
  public error = '';
  constructor(private authenticationService: AuthenticationService,private router: Router, private route: ActivatedRoute) { 
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }
  public dangky () {
    this.router.navigate(['/register']);
  }
  ngOnInit(): void {
    this.frmLogin = new FormGroup({
      'txt_taikhoan': new FormControl('', [Validators.required]),
      'txt_matkhau': new FormControl('', [Validators.required]),
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get taikhoan() {
    return this.frmLogin.get('txt_taikhoan')!;
  }
  get matkhau() {
    return this.frmLogin.get('txt_matkhau')!;
  }
  public Login(vl: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.frmLogin.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(vl.txt_taikhoan, vl.txt_matkhau)
      .pipe(first()).subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.error = error;
          this.loading = false;   
        }
      );


  }

}


