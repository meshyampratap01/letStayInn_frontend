import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ToastModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [MessageService]
})
export class SignupComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  signupClicked = signal<boolean>(false);

  name = '';
  email = '';
  password = '';

  isSignupClicked() {
    return this.signupClicked();
  }

  signup(form: NgForm) {
    if (form.invalid) return;

    this.signupClicked.set(true);

    const signUpSubscription = this.authService
      .signup(this.name, this.email, this.password)
      .subscribe({
        next: (res) => {
          this.signupClicked.set(false);
          form.resetForm();

          this.messageService.add({
            severity: 'success',
            summary: 'Signup Successful',
            detail: res.message || 'You have signed up successfully!',
            life: 3000
          });

          this.router.navigate(['login']);
        },
        error: (err: any) => {
          this.signupClicked.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Signup Failed',
            detail: err?.error?.message || 'There was a problem signing up!',
            life: 3000
          });
        }
      });

    this.destroyRef.onDestroy(() => {
      if (signUpSubscription && typeof signUpSubscription.unsubscribe === 'function') {
        signUpSubscription.unsubscribe();
      }
    });
  }
}
