import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Getter to access the email form control
  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }

  sendOtp() {
    if (this.forgotPasswordForm.valid) {
      const email = this.emailControl?.value;
      localStorage.setItem('registeredMail',email);
      localStorage.setItem('forgotPassword','true')
      this.authService.sendOtp(email).subscribe(
        () => {
          console.log('OTP sent successfully!');
          this.router.navigate(['/auth/otp']);
        },
        (error) => {
          console.error('Failed to send OTP:', error);
          localStorage.removeItem('forgotPassword')
          alert(error.error)
        }
      );
    }
  }
}
