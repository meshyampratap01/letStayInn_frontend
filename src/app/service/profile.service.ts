import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private httpClient = inject(HttpClient);
  userName = new BehaviorSubject<string>('');
  userRole = new BehaviorSubject<string>('');

  constructor() { }

  getProfile(){
    const url='profile';
    return this.httpClient.get<response>(url).pipe(
      tap((res)=>{
        this.userName.next(res.data.name);
        this.userRole.next(res.data.role);
      })
    )
  }
}
