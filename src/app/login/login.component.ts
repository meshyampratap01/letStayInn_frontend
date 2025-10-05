import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    FloatLabelModule,
    MessageModule,
    ToastModule,
    ButtonModule,
    ProgressBarModule,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  // isValid: boolean = false;
  isInvalid = signal(false);

  loginClicked = signal(false);

  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit(): void {
    const tokenStr = JSON.parse(localStorage.getItem('token') as string);

    if (tokenStr) {
      this.router.navigate(['admin']);
    }
  }

  login(form: HTMLFormElement) {
    this.loginClicked.set(true);

    const roleRouteMap: { [key: number]: string } = {
      4: '/admin',
      2: '/kitchen',
      3: '/cleaning',
      1: '/guest',
      0: '/login',
    };

    const loginSubscription = this.authService
      .login(this.email, this.password)
      .subscribe({
        next: () => {
          const user = this.authService.user();
          const userRole = user?.Role ?? 0;
          this.router.navigate([roleRouteMap[userRole]]);
        },
        error: (err: any) => {
          console.error('Login error', err);
          this.isInvalid.set(true);
          this.loginClicked.set(false);
          this.messageService.add({
            severity: 'error',
            closable: true,
            summary: 'Login Failed',
            detail:
              err?.error?.message || 'Invalid credentials or server error',
            life: 4000,
          });
        },
        complete: () => {
          this.loginClicked.set(false);
          console.log('Login complete');
        },
      });
    this.destroyRef.onDestroy(() => {
      if (
        loginSubscription &&
        typeof loginSubscription.unsubscribe === 'function'
      ) {
        loginSubscription.unsubscribe();
      }
    });

    form.reset();
  }

  inputClicked() {
    this.isInvalid.set(false);
  }
}
