import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { HotelService } from 'src/app/core/service/hotel/hotel.service';
 
@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})
export class CreateNewComponent {
  // Property Details
  Location = {
    street: '',
    district: '',
    state: '',
    city: ''
  };
  owner_id: any = localStorage.getItem('userId');
 
  propertyName: string = '';
  address: string = '';
  description: string = '';
  total_Room: number = 0;
 
  // Single Room Details
  singleBedRooms: number = 0;
  singleRoomPrice: number = 0.0;
  singleRoomWifi: boolean = false;
  singleRoomAc: boolean = false;
  singleRoomBf: boolean = false;
  singleRoomPool: boolean = false;
  singleAmenities: string[] = [];
  singleRoomImages: string[] = []; // Hold images for single rooms
 
  // Double Room Details
  doubleBedRooms: number = 0;
  doubleRoomPrice: number = 0.0;
  doubleRoomWifi: boolean = false;
  doubleRoomAc: boolean = false;
  doubleRoomBf: boolean = false;
  doubleRoomPool: boolean = false;
  doubleAmenities: string[] = [];
  doubleRoomImages: string[] = []; // Hold images for double rooms
 
  hotelImages: string[] = []; // Hold images for hotel
 
  roomTypes: any[] = [];
  newProperty: any = {};
 
  constructor(private router: Router, private hotelService: HotelService, private authservice: AuthService) {}
 
  // Update single room amenities based on checkbox selections
  updateSingleAmenities() {
    this.singleAmenities = [];
    if (this.singleRoomWifi) this.singleAmenities.push('Free WiFi');
    if (this.singleRoomAc) this.singleAmenities.push('Air Conditioning');
    if (this.singleRoomBf) this.singleAmenities.push('24-Hour Room Service');
    if (this.singleRoomPool) this.singleAmenities.push('Swimming Pool');
  }
 
  // Update double room amenities based on checkbox selections
  updateDoubleAmenities() {
    this.doubleAmenities = [];
    if (this.doubleRoomWifi) this.doubleAmenities.push('Free WiFi');
    if (this.doubleRoomAc) this.doubleAmenities.push('Air Conditioning');
    if (this.doubleRoomBf) this.doubleAmenities.push('Spa');
    if (this.doubleRoomPool) this.doubleAmenities.push('Gym');
  }
 
  // Handle image selection for hotel
  onHotelImagesSelected(event: any) {
    const files: FileList = event.target.files;
    this.convertToBase64(files, this.hotelImages);
  }
 
  // Handle image selection for single room
  onSingleRoomImagesSelected(event: any) {
    const files: FileList = event.target.files;
    this.convertToBase64(files, this.singleRoomImages);
  }
 
  // Handle image selection for double room
  onDoubleRoomImagesSelected(event: any) {
    const files: FileList = event.target.files;
    this.convertToBase64(files, this.doubleRoomImages);
  }
 
  // Convert selected files to Base64
  private convertToBase64(files: FileList, imagesArray: string[]) {
    const reader = new FileReader();
    let index = 0;
 
    const readFile = (index: number) => {
      if (index >= files.length) return;
      reader.onload = () => {
        imagesArray.push(reader.result as string);
        readFile(index + 1);
      };
      reader.readAsDataURL(files[index]);
    };
 
    readFile(0);
  }
 
  onSubmit() {
    // Update amenities before submitting
    this.updateSingleAmenities();
    this.updateDoubleAmenities();
    // Prepare room types array
    this.roomTypes = [
        {
            roomCategory: 'SINGLE',
            pricePerRoom: this.singleRoomPrice,
            totalRooms: this.singleBedRooms,
            availableRooms: this.singleBedRooms,
            amenities: this.singleAmenities,
            images: this.singleRoomImages // Add single room images
        },
        {
            roomCategory: 'DOUBLE',
            pricePerRoom: this.doubleRoomPrice,
            totalRooms: this.doubleBedRooms,
            availableRooms: this.doubleBedRooms,
            amenities: this.doubleAmenities,
            images: this.doubleRoomImages // Add double room images
        }
    ];
    // Create new property object
    this.newProperty = {
        name: this.propertyName,
        location: {
            street: this.address,
            district: this.Location.district,
            state: this.Location.state,
            city: this.Location.city
        },
        owner_id: this.owner_id,
        description: this.description,
        total_room: this.singleBedRooms + this.doubleBedRooms,
        roomTypes: this.roomTypes,
        images: this.hotelImages // Add hotel images
    };
    // Call the service to create the hotel
    this.hotelService.createHotel(this.newProperty).subscribe({
        next: (response) => {
            console.log('Property submitted successfully:', response);
            alert("Hotel added successfully");
            this.router.navigate(['/my-properties']);
        },
        error: (error) => {
            console.error('Error submitting property:', error);
            console.log(this.newProperty.images);
            console.log('Submitted Property Data:', this.newProperty);
        }
    });
  }}