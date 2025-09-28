import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  imports: [RouterLink],
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  // ...existing code...
}
