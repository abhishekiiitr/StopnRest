// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, NgForm } from '@angular/forms';
// import { Router } from '@angular/router';
// import { of, throwError } from 'rxjs';
// import { RegisterComponent } from './register.component';
// import { AuthService } from 'src/app/core/service/auth.service';
// import { User } from '../../model/user';
// import { MatCardModule } from '@angular/material/card';  // Import MatCardModule
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { ReactiveFormsModule } from '@angular/forms';
// class MockAuthService {
//   register(user: User) {
//     return of({ email: user.email });  // Mock successful response
//   }
// }

// class MockRouter {
//   navigate(path: string[]) {
//     return path;  // Mock navigate function
//   }
// }

// describe('RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;
//   let authService: AuthService;
//   let router: Router;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [RegisterComponent],
//       imports: [FormsModule,MatCardModule,MatFormFieldModule,ReactiveFormsModule],  // Import FormsModule for NgForm
//       providers: [
//         { provide: AuthService, useClass: MockAuthService },
//         { provide: Router, useClass: MockRouter }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     authService = TestBed.inject(AuthService);
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should set submitted to true on form submission', () => {
//     component.register();
//     expect(component.submitted).toBeTrue();
//   });

//   it('should not proceed if the form is invalid', () => {
//     component.registrationForm = { valid: false } as NgForm; // Mock form as invalid
//     spyOn(authService, 'register').and.callThrough();
//     component.register();
//     expect(authService.register).not.toHaveBeenCalled();
//   });

//   it('should show an alert for password mismatch', () => {
//     component.user.password = 'password123';
//     component.confirmPassword = 'differentPassword';
//     spyOn(window, 'alert');  // Spy on alert function
//     component.register();
//     expect(window.alert).toHaveBeenCalledWith('password mismatch');
//   });

//   it('should call authService.register and navigate on successful registration', () => {
//     component.user.email = 'test@example.com';
//     component.user.password = 'password123';
//     component.confirmPassword = 'password123';
    
//     spyOn(authService, 'register').and.callThrough();
//     spyOn(router, 'navigate');  // Spy on navigate method

//     component.register();
    
//     expect(authService.register).toHaveBeenCalledWith(component.user);
//     expect(localStorage.getItem('registeredMail')).toBe('test@example.com');
//     expect(router.navigate).toHaveBeenCalledWith(['/auth/otp']);
//   });

//   it('should show an alert on registration failure', () => {
//     spyOn(authService, 'register').and.returnValue(throwError('Registration error'));
//     spyOn(window, 'alert');  // Spy on alert function
    
//     component.register();

//     expect(window.alert).toHaveBeenCalledWith('Registration failed. Please try again.');
//   });

//   it('should navigate to the login page on continueToLogin call', () => {
//     spyOn(router, 'navigate');  // Spy on navigate method
//     component.continueToLogin();
//     expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
//   });
// });
