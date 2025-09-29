import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { GuestComponent } from './dashboard/guest/guest.component';
import { authGuard } from './guard/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'guest',
    component: GuestComponent,
    canActivate: [authGuard]
  },
  {
    path: 'logout',
    component: LoginComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    component: ErrorComponent,
  }
];
