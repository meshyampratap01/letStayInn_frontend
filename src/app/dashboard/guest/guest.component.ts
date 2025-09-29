import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Roles } from '../../models/user';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-guest',
  imports: [HeaderComponent],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss'
})
export class GuestComponent {
    authService = inject(AuthService);

  userName = this.authService.user()?.UserName as string;
  role = this.authService.user()?.Role as Roles;
  userRole = Roles[this.role]
}
