import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { ProfileService } from '../../service/profile.service';
import { profileDTO } from '../../models/user';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TagModule, CardModule, ButtonModule,HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private profileService = inject(ProfileService);

  user?: profileDTO;

  userName: string='';
  userRole: string='';

  constructor() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.userName= this.user?.name as string;
        this.userRole= this.user?.role as string;
      }
    });
  }

  get userInitials(): string {
    if (!this.user?.name) return '';
    const names = this.user.name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }
}
