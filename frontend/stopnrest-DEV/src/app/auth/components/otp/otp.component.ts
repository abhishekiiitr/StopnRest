import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent {
  Otp: string = '';
  password: string = '';
  confirmPassword: string = '';
  isOtpVerified: boolean = false;
  forgotPassword: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
    // Retrieve 'forgotPassword' status from localStorage
    this.forgotPassword = JSON.parse(localStorage.getItem('forgotPassword') || 'false');
  }

  onSubmit() {
    this.auth.verifyOtp(this.Otp).subscribe({
      next: (response: any) => {
        if (response.verified) {
          this.isOtpVerified = true;

          if (this.forgotPassword) {
            // OTP Verified - Show Reset Password Form
            Swal.fire({
              title: 'OTP Verified',
              text: 'Please reset your password.',
              icon: 'success',
            });
          } else {
            // Call registration mail if not in forgot password flow
            this.sendRegistrationMail();
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid OTP',
            text: 'Please try again!',
          });
        }
      },
      error: (err: any) => {
        console.error('OTP verification failed', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'OTP verification failed. Please try again later.',
        });
      },
    });
  }

  sendRegistrationMail() {
    const email = localStorage.getItem('registeredMail');
    this.auth.sendRegistrationMail(email).subscribe({
      next: () => {
        Swal.fire({
          title: 'Registration Successful',
          text: 'A confirmation email has been sent to your registered email address.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: (err: any) => {
        console.error('Failed to send registration mail', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send registration email. Please try again.',
        });
      },
    });
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
      });
      return;
    }

    this.auth.resetPassword(this.password).subscribe({
      next: () => {
        Swal.fire({
          title: 'Password Reset Successful',
          text: 'You will be redirected to the login page.',
          icon: 'success',
        }).then(() => {
          localStorage.removeItem('forgotPassword');
          this.router.navigate(['/auth/login']);
        });
      },
      error: (err: any) => {
        console.error('Password reset failed', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to reset password. Please try again.',
        });
      },
    });
  }
}
