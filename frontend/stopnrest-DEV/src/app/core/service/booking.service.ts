import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../../auth/model/Booking'; // Import Booking model
import { AuthService } from '../service/auth.service'; // Import AuthService
import { Transaction } from '../../auth/model/Transaction';
import { HotelService } from './hotel/hotel.service';
import { Hotel } from 'src/app/shared/models/hotel.model';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:1111/bookings'; // Spring Boot URL
  userId: string | null = null; // UserId from localStorage
  hotelName:string|null=null;
  constructor(private http: HttpClient, private authService: AuthService,private hotelService:HotelService) { 
    this.userId = this.getUserId();
  }
/*getHotelName(hotelId:string):string{
this.hotelService.getHotelById()
}*/
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Get previous and upcoming bookings by user ID
  getBookingsForUser(userId: string): Observable<{ previousBookings: Booking[], upcomingBookings: Booking[] }> {
    const token = this.authService.getToken(); // Get the token from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('userId', userId); // Create HttpParams

    return this.http.get<{ previousBookings: Booking[], upcomingBookings: Booking[] }>(
      `${this.baseUrl}`, 
      { 
        headers, 
        params // Include headers and params in the request
      }
    ).pipe(
      catchError(this.handleError) // Add error handling
    );
  }
  
  // Delete booking by booking ID
  deleteBooking(bookingId: string): Observable<any> {
    const token = this.authService.getToken(); // Get the token from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('bookingId', bookingId); // Create HttpParams
    console.log("I'm getting called dw!");
    return this.http.put<any>(`${this.baseUrl}/cancel/${bookingId}`, { headers });
    
     
    console.log("I called dw!");
  }
  

  createBooking(booking: Booking): Observable<any> {
    const token = this.authService.getToken(); // Get the token from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.baseUrl}/booknow`, booking, { headers });
  }

 /* processTransaction(transactionId: string, status: string): Observable<Transaction> {
    const token = this.authService.getToken(); // Get the token from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('transactionId', transactionId)
      .set('status', status);

    return this.http.post<Transaction>(`${this.baseUrl}/process-transaction`, {}, { headers, params }).pipe(
      catchError(this.handleError) // Add error handling
    );
  }*/

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      console.error('An error occurred:', error.error.message);
    
    }
    // Return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
