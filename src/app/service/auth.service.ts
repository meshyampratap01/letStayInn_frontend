import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { loginResponse, payload } from '../models/login';
import { catchError, tap } from 'rxjs';

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
    const url = 'http://localhost:8080/api/v1/login';
    return this.httpClient
      .post<loginResponse>(url, { email, password })
      .pipe(
        tap((response) => {
          const user = this.decodeJWT(response.token);
          this.user.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError((error) => {
          console.error('Login failed', error);
          throw error;
        })
      );
  }
  private decodeJWT(token: string): User {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload: payload = JSON.parse(payloadJson);
    return {
      ID: payload.id,
      UserName: payload.name,
      Role:
        payload.role === 'admin'
          ? 4
          : payload.role === 'kitchenstaff'
          ? 2
          : payload.role === 'cleaningstaff'
          ? 3
          : 1,
    };
  }
}
