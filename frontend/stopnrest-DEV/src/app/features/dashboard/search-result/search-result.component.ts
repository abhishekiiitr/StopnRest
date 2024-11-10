import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hotel, HotelSearchResponse } from '../../../shared/models/hotel.model';
import { BookingDialogComponent } from '../booking/booking-dialog/booking-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnChanges {
  @Input() hotels: Hotel[] = [];
  @Input() location: string = '';
  @Input() checkIn: Date | null = null;
  @Input() checkOut: Date | null = null;
  @Input() isDatesProvided : boolean | null = null;
  @Input() hotelSearch: HotelSearchResponse[]= [];
  @Input() isSearched: boolean | null = null ;

  constructor(public dialog: MatDialog, private toaster: ToastrService,private snackBar: MatSnackBar) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['hotels']) {
      console.log('Hotels updated:', this.hotels);
    }
  }

  getAverageRating(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }

  getLowestPrice(roomTypes: any[]): number {
    if (roomTypes.length === 0) return 0;
    return Math.min(...roomTypes.map(room => room.pricePerRoom));
  }

  onBookNow(){
    if(!this.isDatesProvided){
      this.toaster.warning("Search with checkin/checkout details!");
      // alert('Please search with check-in and check-out dates to book the rooms.');
      // this.snackBar.open('Please search with check-in and check-out dates to book the rooms.', 'Close', { duration: 3000 });
      return;
    }
  }

  // getting error due below 2 funtions so remove them and user commented html for image source once we have images in our db ---------------------
  getRandomImage() {
    return Math.floor(Math.random() * 3) + 1;
  }

  getImageSource(hotel: Hotel) {
    if (hotel.images.length > 0) {
      return hotel.images[0];
    } else {
      return 'assets/hotel' + this.getRandomImage() + '.jpeg';
    }
  }

  getImageSource1(hotel: HotelSearchResponse) {
    if (hotel.images.length > 0) {
      return hotel.images[0];
    } else {
      return 'assets/hotel' + this.getRandomImage() + '.jpeg';
    }
  }


  // -----------For booking dialog components ---------------------
  openBookingDialog(hotel: HotelSearchResponse) {
   /* const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: {
        hotel: hotel,
        roomCategory: hotel.roomAvailability.SINGLE ? 'SINGLE' : 'DOUBLE' // Default to SINGLE, change as needed
      }
    });

    // Optionally handle the data when the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Booking Data:', result); // Handle booking data after confirmation
      }
    });
  */
    if (!this.checkIn|| !this.checkOut) {
      alert('Please select both Check-In and Check-Out dates.');
      return;
    }

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: {
        hotel: hotel,
        roomCategory: hotel.roomAvailability.SINGLE ? 'SINGLE' : 'DOUBLE', // Default to SINGLE, change as needed
        checkIn: this.checkIn,
        checkOut: this.checkOut
      }
    });
}

}