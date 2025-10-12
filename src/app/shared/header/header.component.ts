import { Component, input, Input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Button } from "primeng/button";
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [Button]
})
export class HeaderComponent {
  userName = input.required<string>()
  userRole = input.required<string>()

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['profile']);
  }
}
