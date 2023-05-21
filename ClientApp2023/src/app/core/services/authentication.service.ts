import { environment } from './../../../environments/environment';
import { User } from './../entities/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<any>;
    public user: Observable<User>;
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();
    }
    public get userValue(): User {
        return this.userSubject.value && this.userSubject.value.taiKhoan ? this.userSubject.value: null;
       
    }
    login(username: string, password: string) {
        return this.http.post<any>(`${environment.BASE_API}/api/Auth/authenticate`, { username, password })
            .pipe(map(user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }
    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
    remove() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }
}