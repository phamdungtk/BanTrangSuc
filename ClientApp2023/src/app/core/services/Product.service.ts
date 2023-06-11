import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http: HttpClient) { }

  isExpired(thoiGianKetThuc: string): Observable<boolean> {
    const url = `${environment.BASE_API}/api/SanPhams/${thoiGianKetThuc}`;
    return this.http.get<boolean>(url);
    
  }
}
