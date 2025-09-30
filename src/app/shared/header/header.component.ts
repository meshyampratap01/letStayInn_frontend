import { Component, input, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from "primeng/button";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [Button]
})
export class HeaderComponent {
  // @Input() userName: string = '';
  userName = input.required<string>()
  // @Input() userRole: string = '';
  userRole = input.required<string>()

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
