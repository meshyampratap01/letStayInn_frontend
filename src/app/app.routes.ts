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
import { EmployeeComponent } from './dashboard/employee/employee.component';
import { ProfileComponent } from './shared/profile/profile.component';
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
        path:'',
        redirectTo: 'rooms',
        pathMatch: "prefix",
      },
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
    canActivate: [authGuard],
    children: [
      {
        path:'',
        redirectTo: 'book-room',
        pathMatch: "prefix",
      },
      {
        path: 'my-bookings',
        loadComponent: () =>
          import('./dashboard/guest/my-bookings/my-bookings.component').then(m=>m.MyBookingsComponent),
      },
      {
        path: 'book-room',
        loadComponent: () =>
          import('./dashboard/guest/room/room.component').then(m=>m.RoomComponent)
      },
      {
        path: 'service-requests',
        loadComponent: () =>
          import('./dashboard/guest/service-request/service-request.component').then(m=>m.ServiceRequestComponent)
      },
      {
        path: 'feedbacks',
        loadComponent: ()=>
          import('./dashboard/guest/feedback/feedback.component').then(m=>m.FeedbackComponent)
      },
    ]
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'logout',
    component: LoginComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
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
