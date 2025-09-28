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
    const loginSubscription = this.authServcie.login(this.email, this.password).subscribe({
      next: () => {
        // if (this.authServcie.user()?.Role === 4) {
        //   this.router.navigate(['/admin']);
        // } else if (this.authServcie.user()?.Role === 2) {
        //   this.router.navigate(['/kitchen']);
        // } else if (this.authServcie.user()?.Role === 3) {
        //   this.router.navigate(['/cleaning']);
        // } else {
        //   this.router.navigate(['/welcome']);
        // }
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Login error', err);
      },
      complete: () => {
        console.log('Login complete');
      }
    });
  }

}