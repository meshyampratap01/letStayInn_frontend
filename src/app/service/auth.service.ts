import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Roles, User } from '../models/user';
import { loginResponse, payload } from '../models/login';
import { catchError, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);

  user = signal<User | null>(null);

  constructor() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }

  login(email: string, password: string) {
    const url = 'login';
    return this.httpClient
      .post<loginResponse>(url, { email, password })
      .pipe(
        tap((response) => {
          const newUser = this.decodeJWT(response.data.token);
          this.user.set(newUser);
          localStorage.setItem('token',JSON.stringify(response.data.token))
          localStorage.setItem('user', JSON.stringify(newUser));
        }),
      );
  }
  private decodeJWT(token: string): User {
    try{
      const payload = jwtDecode<payload>(token);
      return {
        ID: payload.user_id,
        UserName: payload.username,
        Role: 
        payload.role === 'Manager'
        ? 4
        : payload.role === 'KitchenStaff'
        ? 2
        :payload.role === 'CleaningStaff'
        ? 3
        : 1,
      };
    } catch (err){
      console.error('Invalid JWT',err);
      return {ID: '', UserName: '', Role:0};
    }
  }

  isloggedin():boolean{
    const prevUser = localStorage.getItem('user');
    if (prevUser!=null){
      return true;
    }
    return false;
  }

  isAdmin():boolean{
    const token = localStorage.getItem('token') as string;
    const currUser = this.decodeJWT(token);
    if (currUser.Role===4){
      return true;
    }
    return false;
  }

  signup(name:string, email: string, password:string){
    const url= `signup`;
    return this.httpClient.post<response>(url,{
      name: name,
      email:email,
      password:password,
    })
  }
}
