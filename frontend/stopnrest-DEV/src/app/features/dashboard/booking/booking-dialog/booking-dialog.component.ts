import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotelSearchResponse } from '../../../../shared/models/hotel.model';
import { BookingService } from 'src/app/core/service/booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Booking } from 'src/app/auth/model/Booking';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent {
  numRooms: number = 1;
  userName: string = '';
  userEmail: string = '';
  totalAmount: number = 0;

  // Email regex pattern
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { hotel: HotelSearchResponse, roomCategory: 'SINGLE' | 'DOUBLE', checkIn: Date, checkOut: Date },
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    public bookingService: BookingService,
    private toastr : ToastrService
  ) {
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    const roomPrice = this.getRoomPrice(this.data.hotel, this.data.roomCategory);
    this.totalAmount = this.numRooms * roomPrice;
  }

  // Get available rooms based on the category (SINGLE/DOUBLE)
  getAvailableRooms(hotel: HotelSearchResponse, category: 'SINGLE' | 'DOUBLE'): number {
    return hotel.roomAvailability[category]?.availableCount || 0;
  }

  // Get room price based on the category
  getRoomPrice(hotel: HotelSearchResponse, category: 'SINGLE' | 'DOUBLE'): number {
    return hotel.roomAvailability[category]?.pricePerNight || 0;
  }

  // Cancel the booking and close the dialog
  onCancel(): void {
    this.dialogRef.close();
  }

  // Confirm the booking process
  onConfirmBooking(): void {
    if (!this.isValid()) {
      alert('Please fill in all fields correctly.'); // Optionally show an error message
      return;
    }

    const bookingData: Booking = {
      hotelId: this.data.hotel.hotelId,
      userId: localStorage.getItem("userId") || '',
      roomCategory: this.data.roomCategory,
      rooms: this.getSelectedRoomIds(), // Array of selected room IDs
      userName: this.userName,
      userEmail: this.userEmail,
      checkIn: this.data.checkIn,
      checkOut: this.data.checkOut,
      totalPrice: this.numRooms * this.getRoomPrice(this.data.hotel, this.data.roomCategory),
      bookingDate: new Date(),
      status: 'CONFIRMED'
    };

    // Call the booking service to create the booking
    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking confirmed:', response);
        this.toastr.success('Booking confirmed!', 'Success');
        alert('Booking confirmed mate!!');
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error occurred during booking:', error);
      }
    });
  }

  getSelectedRoomIds(): string[] {
    const availableRooms = this.data.hotel.roomAvailability[this.data.roomCategory]?.availableRoomIds || [];
    return availableRooms.slice(0, this.numRooms);
  }

  // Check if the inputs are valid
  isValid(): boolean {
    const isNameValid = this.userName.length > 0;
    const isEmailValid = this.emailPattern.test(this.userEmail);
    return this.numRooms > 0 && isNameValid && isEmailValid;
  }
}
