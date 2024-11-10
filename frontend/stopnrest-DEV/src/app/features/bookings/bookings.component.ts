import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from '../../core/service/booking.service';
import { Booking } from '../../auth/model/Booking';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HotelService } from '../../core/service/hotel/hotel.service'; // Import HotelService
import { Hotel } from 'src/app/shared/models/hotel.model';

// Extend Booking to include hotelName
export interface BookingWithHotelName extends Booking {
  hotelName?: string; // Optional hotelName property
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit, OnDestroy {
  previousBookings: BookingWithHotelName[] = []; // Use the extended interface
  upcomingBookings: BookingWithHotelName[] = []; // Use the extended interface
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();
  previousDisplayedColumns: string[] = ['bookingId', 'date', 'price', 'status'];
  upcomingDisplayedColumns: string[] = ['bookingId','date', 'price', 'status', 'action'];

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService, // Inject HotelService
    private snackBar: MatSnackBar // Assuming you're using Angular Material for notifications
  ) { }
  userId: string | null = null;


  ngOnInit(): void {/*  */
    this.userId = this.bookingService.getUserId();
    console.log('Fetched User ID:', this.userId);
    if (this.userId) {
      this.loadBookings(this.userId); // Fetch bookings if userId is available
    }
  }

  loadBookings(userId: string): void {
    this.isLoading = true;
    this.bookingService.getBookingsForUser(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response: { previousBookings: Booking[], upcomingBookings: Booking[] }) => {
          // Convert string dates to Date objects
          this.previousBookings = response.previousBookings.map(booking => ({
            ...booking,
            checkIn: booking.checkIn ? new Date(booking.checkIn) : null,    // Convert string to Date if exists
            checkOut: booking.checkOut ? new Date(booking.checkOut) : null,  // Convert string to Date if exists
            bookingDate: booking.bookingDate ? new Date(booking.bookingDate) : null // Convert string to Date if exists

          })) as BookingWithHotelName[]; // Cast to BookingWithHotelName

          this.upcomingBookings = response.upcomingBookings.map(booking => ({
            ...booking,
            checkIn: booking.checkIn ? new Date(booking.checkIn) : null,    // Convert string to Date if exists
            checkOut: booking.checkOut ? new Date(booking.checkOut) : null,  // Convert string to Date if exists
            bookingDate: booking.bookingDate ? new Date(booking.bookingDate) : null // Convert string to Date if exists

          })) as BookingWithHotelName[]; // Cast to BookingWithHotelName

          // Fetch hotel names for all bookings after they are loaded
          //this.fetchHotelNames(this.previousBookings);
          //this.fetchHotelNames(this.upcomingBookings);

          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to load bookings.', 'Close', { duration: 3000 });
        }
      );
  }

  // Method to fetch hotel names based on hotel ID in each booking
  /*fetchHotelNames(bookings: BookingWithHotelName[]): void {
    bookings.forEach(booking => {
      if (booking.hotelId) { // Assuming each booking has a hotelId
        this.hotelService.getHotelById(booking.hotelId).subscribe(
          (hotel: Hotel) => {
            booking.hotelName = hotel.name; // Assign hotelName property for display
          },
          (error) => {
            console.error('Error fetching hotel:', error);
          }
        );
      }
    });
  }*/

    cancelBooking(booking: Booking): void {
      // Check if bookingId is present
      if (!booking.bookingId) {
        this.snackBar.open('Booking ID is missing.', 'Close', { duration: 3000 });
        return; // Exit if there's no booking ID
      }
    
      // Proceed to delete the booking using the bookingId
      this.bookingService.deleteBooking(booking.bookingId.toString()).pipe(
        tap(updatedBooking => {
          // Update the booking status in the UI
          const index = this.upcomingBookings.findIndex(b => b.bookingId === updatedBooking.bookingId);
          if (index !== -1) {
            // Convert updatedBooking dates if necessary
            updatedBooking.checkIn = updatedBooking.checkIn ? new Date(updatedBooking.checkIn) : undefined;
            updatedBooking.checkOut = updatedBooking.checkOut ? new Date(updatedBooking.checkOut) : undefined;
            updatedBooking.bookingDate = updatedBooking.bookingDate ? new Date(updatedBooking.bookingDate) : undefined;
            
            // Update the upcoming bookings array
            this.upcomingBookings[index] = updatedBooking; // Replace the canceled booking with the updated one
          }
          this.snackBar.open('Booking canceled successfully!', 'Close', { duration: 3000 });
        }),
        catchError(error => {
          console.error('Failed to cancel booking:', error);
          this.snackBar.open(`Failed to cancel booking: ${error.error?.message || 'An error occurred.'}`, 'Close', { duration: 3000 });
          return throwError(error);  // Re-throw the error for further handling
        })
      ).subscribe(); // Don't forget to subscribe to the observable
    }
    
  // Other methods...



  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
