import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { AuthRequest } from '../../model/authRequest';
import { ApiResponse } from '../../model/response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  credentials: AuthRequest = { email: '', password: '' };  // Initialize with empty email and password

  constructor(private authService: AuthService, private router: Router) {}

  // login() {
  //   this.authService.login(this.credentials).subscribe({
  //     next: (response: Response) => {
  //       this.authService.storeToken(response.token, response.user.id);
  //       console.log(response)  // Store the JWT token
  //       this.router.navigate(['/dashboard']);  // Redirect to dashboard after successful login
  //     },
  //     error: (err) => {
  //       console.error('Login error:', err);
  //       alert('Login failed. Please check your credentials.');
  //     }
  //   });
  // }
  login() {
    this.authService.login(this.credentials).subscribe({
      next: (response: ApiResponse) => { 
        const userId = response.user?.id;  // Use optional chaining to avoid undefined errors
        const token = response.token;
        const role=response.user?.role;
          this.authService.storeToken(token, userId,role);  // Store token and user ID
          this.router.navigate(['/dashboard']);          // Redirect to dashboard
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials.'+err.error);
      }
    });
  }
  
  
  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
  navigateToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}


