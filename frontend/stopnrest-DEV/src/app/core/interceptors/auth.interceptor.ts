import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {} // Inject ToastrService

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);

    // Clone request and add the Authorization header if token exists
    let clonedRequest = request;
    if (token) {
      clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
        withCredentials: true
      });
      console.log('Cloned Request Headers:', clonedRequest.headers);  // Log the headers
    }

    // Pass the cloned request and handle errors
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error caught in interceptor:', error);

        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Client-side error (e.g., network issue)
          errorMessage = `Client-side error: ${error.error.message}`;
          this.toastr.error(errorMessage, 'Error');
        } else {
          // Server-side error
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
          this.toastr.error(errorMessage, 'Error'); // Show server error toast
        }

        // Log detailed error for debugging
        console.error('Error Details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });

        // Display different error messages based on status codes
        switch (error.status) {
          case 401:
            this.toastr.warning('Unauthorized access. Please login.', 'Warning');
            break;
          case 403:
            this.toastr.warning('Access forbidden: insufficient permissions.', 'Warning');
            break;
          case 404:
            this.toastr.error('Resource not found.', 'Error');
            break;
          case 500:
            this.toastr.error('Internal server error.', 'Error');
            break;
          default:
            this.toastr.error('An unexpected error occurred.', 'Error');
        }

        // Re-throw the error so other parts of the app can handle it
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
