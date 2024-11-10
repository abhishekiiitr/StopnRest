import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: jasmine.createSpy('login'),
      setLoggedIn: jasmine.createSpy('setLoggedIn'),
      storeToken: jasmine.createSpy('storeToken') 
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in successfully and navigate to dashboard', () => {
    const response = { token: 'fakeToken', user: { id: 'fakeUserId' } };
    authServiceMock.login.and.returnValue(of(response));

    component.credentials = { email: 'test@example.com', password: 'password' }; 

    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith(component.credentials);
    expect(authServiceMock.storeToken).toHaveBeenCalledWith(response.token, response.user.id);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should alert on login error', () => {
    authServiceMock.login.and.returnValue(throwError('Login error'));

    spyOn(window, 'alert');

    component.credentials = { email: 'test@example.com', password: 'wrongpassword' };
    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith(component.credentials);
    expect(window.alert).toHaveBeenCalledWith('Login failed. Please check your credentials.');
  });
});
