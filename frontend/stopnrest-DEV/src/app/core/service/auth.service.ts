import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from 'src/app/auth/model/authRequest';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/auth/model/response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:1111/auth';


  constructor(private http: HttpClient, private router: Router) {}

  
  login(authRequest: AuthRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/na/login`, authRequest);
  }


  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/na/register`, user);
  }
  verifyOtp(otp:String):Observable<any>{
    return this.http.post(`${this.apiUrl}/na/verify-otp`,{
      email:localStorage.getItem('registeredMail'),
      otp:otp
    })
  }
  sendOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/na/forgot-password?email=${email}`,
      {},
      { responseType: 'text' as 'json' } // Correct way to cast response type
    );
  }
  resetPassword(password:String): Observable<any>{
    const email=localStorage.getItem('registeredMail');
    return this.http.put(
      `${this.apiUrl}/na/reset-password?email=${email}&password=${password}`,
      {},
      { responseType: 'text' as 'json' } // Correct way to cast response type
    );
  }
  sendRegistrationMail(email:any):Observable<any>{
    return this.http.post(
      `${this.apiUrl}/na/send-registration?email=${email}`,
      {},
      { responseType: 'text' as 'json' } // Correct way to cast response type
    );
  }

  // Store the JWT token in localStorage
  storeToken(token: string,userId:string,role:string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);

  }

  // Retrieve the token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Clear the token on logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    this.router.navigate(['/auth/login']);
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();  // Returns true if there's a token
  }
  isLoggedIn(): boolean {
    // Logic to check if the user is authenticated
    return !!localStorage.getItem('authToken');  // Example check based on stored token
  }
}
