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
// import { RoomsComponent } from './dashboard/admin/rooms/rooms.component';
// import { EmployeeComponent } from './dashboard/admin/employee/employee.component';

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
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'rooms',
        loadComponent: () =>
          import('./dashboard/admin/rooms/rooms.component').then(m => m.RoomsComponent),
      },
      {
        path: 'employee',
        loadComponent: () =>
          import('./dashboard/admin/employee/employee.component').then(m => m.EmployeeComponent),
      },
      {
        path: 'service-requests',
        loadComponent: () =>
          import('./dashboard/admin/service-request/service-request.component').then(m=>m.ServiceRequestComponent),
      },
      {
        path: 'feedbacks',
        loadComponent: () =>
          import('./dashboard/admin/feedback/feedback.component').then(m=>m.FeedbackComponent),
      }
    ]
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
