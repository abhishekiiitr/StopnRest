import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HotelService } from 'src/app/core/service/hotel/hotel.service';
import { Hotel } from 'src/app/shared/models/hotel.model';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {
  @Input() hotelId: string | null = null;
  @Output() back = new EventEmitter<void>();

  hotel: Hotel | undefined;
  isEditing: boolean = false;

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    if (this.hotelId) {
      this.loadProperty(this.hotelId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hotelId'] && changes['hotelId'].currentValue) {
      this.loadProperty(changes['hotelId'].currentValue);
    }
  }

  private loadProperty(id: string) {
    if (!id) return;
    this.hotelService.getHotelById(id).subscribe(
      (hotel) => {
        this.hotel = hotel;
        console.log('Hotel loaded:', this.hotel);
      },
      (error) => {
        console.error('Failed to load hotel details:', error);
      }
    );
  }

  enableEditMode() {
    this.isEditing = true;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if (this.hotel) {
      const hotelId = this.hotel.hotel_id;
  
      if (!hotelId) {
        console.error('Hotel ID is undefined.');
        return;
      }
  
      // Create an updatedHotel object based on the existing structure
      const updatedHotel: Hotel= {
        hotel_id: hotelId,
        name: this.hotel.name,
        location: {
          city: this.hotel.location.city
        },
        description: this.hotel.description,
        owner_id: this.hotel.owner_id,
        total_room: this.hotel.total_room,
        roomTypes: this.hotel.roomTypes.map(roomType => ({
          roomCategory: roomType.roomCategory,
          pricePerRoom: roomType.pricePerRoom,
          totalRooms: roomType.totalRooms,
          availableRooms: roomType.availableRooms,
          amenities: roomType.amenities,
          images: roomType.images,
          rooms: roomType.rooms.map(room => ({
            roomId: room.roomId,
            bookingDatesList: room.bookingDatesList.map(booking => ({
              BookingID: booking.BookingID,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut
            })),
          })),
        })),
        images: this.hotel.images,
        ratings: this.hotel.ratings
      };
  
      this.hotelService.updateHotel(hotelId, updatedHotel).subscribe(
        response => {
          console.log('Hotel updated successfully', response);
          this.isEditing = false; // Exit edit mode
        },
        error => {
          console.error('Error updating hotel', error);
        }
      );
    }
  }
  

  onBack() {
    this.back.emit(); // Emit back event to return to property list
  }
}
