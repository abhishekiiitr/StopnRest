import { Component ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../../model/user';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('registrationForm') registrationForm!: NgForm;
  user: User = new User();
  submitted: boolean = false; 
  confirmPassword:string='';
  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.submitted = true;  // Set submitted to true on form submission

    if (!this.registrationForm.valid) {
      return;  // Exit if form is invalid
    }
    if (this.user.password !== this.confirmPassword) {
      alert("password mismatch");
      return;
    }
    this.authService.register(this.user).subscribe({
      next: (response:any) => {
        localStorage.setItem('registeredMail',response.email)
        alert('Registration successful! please verify your OTP');
        this.router.navigate(['/auth/otp']);  // Redirect to login page after successful registration
      },
      error: (err) => {
        alert('Registration failed. Please try again.');
      }
    });
  }
  continueToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
