import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const token = localStorage.getItem('token');

  
  if (!token || isTokenExpired(token)) {
    alert('Your session has expired. Please log in again.');
    // authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return router.createUrlTree(['/unauthorized']);
  }


  if (authService.isAdmin()){
    return true;
  }else{
    return router.createUrlTree(['/unauthorized']);
  }
};


function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return expiry < now;
  } catch (e) {
    return true;
  }
}