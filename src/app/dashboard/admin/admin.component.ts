import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../service/auth.service';
import { Roles } from '../../models/user';
// import { Roles } from '../../models/user';
import { Card, CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AdminService } from '../../service/admin.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent,CardModule,Card,AvatarModule, ProgressSpinnerModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  authService = inject(AuthService);
  isRoomLoading = signal(true);
  isServiceLoading = signal(true);

  userName = this.authService.user()?.UserName as string;
  role = this.authService.user()?.Role as Roles;
  userRole = Roles[this.role]

  adminService = inject(AdminService);

  ngOnInit(): void {
    this.adminService.loadRooms().subscribe({
      next: ()=>{
        this.isRoomLoading.set(false);
      }
    });

    this.adminService.loadServiceRequest().subscribe({
      next: ()=>{
        this.isServiceLoading.set(false);
      }
    })
  }

  availableRooms = this.adminService.availableRooms;
  occupiedRooms = this.adminService.occupiedRooms;
  pendingSvcRqst = this.adminService.pendingRequests;
}
