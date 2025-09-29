import { Component, DestroyRef, inject, signal } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
// import { subscribeOn, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    FloatLabelModule,
    MessageModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  // isValid: boolean = false;
  isInvalid = signal(false);

  loginClicked = signal(false);

  private authServcie = inject(AuthService);
  // private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  login(form: HTMLFormElement) {
    this.loginClicked.set(true);
    // setTimeout(() => {

    // }, 4000);

    const loginSubscription = this.authServcie
      .login(this.email, this.password)
      .subscribe({
        next: () => {
          if (this.authServcie.user()?.Role === 4) {
            this.router.navigate(['/admin']);
          } else if (this.authServcie.user()?.Role === 2) {
            this.router.navigate(['/kitchen']);
          } else if (this.authServcie.user()?.Role === 3) {
            this.router.navigate(['/cleaning']);
          } else {
            this.router.navigate(['/guest']);
          }
          // this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Login error', err);
          this.isInvalid.set(true);
          this.loginClicked.set(false);
        },
        complete: () => {
          this.loginClicked.set(false);
          console.log('Login complete');
        },
      });
      this.destroyRef.onDestroy(()=>{
        loginSubscription.unsubscribe()
      });

      form.reset();
  }

  inputClicked() {
    this.isInvalid.set(false);
  }
}
