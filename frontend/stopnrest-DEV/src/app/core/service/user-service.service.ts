import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/model/response';
import { UpdateProfile } from 'src/app/auth/model/updateProfile';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  constructor(private http: HttpClient) { }

  private apiUrl='http://localhost:1111/auth'

  private username: string = 'admin'; 
  private authenticated = false;
  getUsername(): string {
    return this.username;
  }
  getEmail(): string {
    return 'your-email@example.com';
  }
logout() {
  return this.authenticated = false;
  //console.log('User has been logged out');
}
isLoggedIn(): boolean {
  return this.authenticated; 
}
getUserById(userId: any, token: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
  editPassword(id: any, password: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put(`${this.apiUrl}/editPassword/${id}`, null, {
      headers,
      params: { password }
    });
  }

  // Method to update user profile
  editProfile(id: any, profileDetail: UpdateProfile, token: any): Observable<UpdateProfile> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put<UpdateProfile>(`${this.apiUrl}/editProfile/${id}`, profileDetail, { headers });
}

}

