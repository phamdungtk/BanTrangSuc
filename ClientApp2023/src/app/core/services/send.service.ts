import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SendService {
  private objSubject = new BehaviorSubject<any>(null);
  objs = this.objSubject.asObservable();
  constructor() {
    this.objSubject.next(null); 
  }
  addObjct(item:any) {
    this.objSubject.next(item);
  }
}