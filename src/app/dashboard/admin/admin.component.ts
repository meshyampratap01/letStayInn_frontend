import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../service/auth.service';
import { Roles } from '../../models/user';
// import { Roles } from '../../models/user';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  authService = inject(AuthService);

  userName = this.authService.user()?.UserName as string;
  role = this.authService.user()?.Role as Roles;
  userRole = Roles[this.role]
}
