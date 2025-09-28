import { Component, DestroyRef, inject } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router} from '@angular/router';
import { AuthService } from '../service/auth.service';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string= '';

  private authServcie = inject (AuthService);
  private destroyRef = inject (DestroyRef);
  private router = inject(Router);

  login(){
    
  }
}
