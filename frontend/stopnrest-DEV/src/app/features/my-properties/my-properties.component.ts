import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hotel } from 'src/app/shared/models/hotel.model';
import { HotelService } from 'src/app/core/service/hotel/hotel.service';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit {
  properties: Hotel[] = [];
  ownerId: string | null = null;
  selectedHotelId: string | null = null; // Track selected hotel for view mode

  constructor(private router: Router, private hotelService: HotelService) {}

  ngOnInit(): void {
    this.ownerId = this.hotelService.getUserId();
    if (this.ownerId) {
      this.loadProperties(this.ownerId);
    }
  }

  private loadProperties(owner_id: string) {
    this.hotelService.findHotelByOwnerId().subscribe(
      (hotels) => {
        this.properties = hotels;
        console.log('Properties loaded:', this.properties);
      },
      (err) => {
        console.error('Error loading properties:', err);
        alert('Failed to load properties. Please try again later.');
      }
    );
  }

  getCategories(hotel: Hotel): string {
    return hotel.roomTypes.map(r => r.roomCategory).join(', ');
  }

  onCreateNew() {
    this.router.navigate(['/my-properties/create-new']);
  }

  onView(id: string) {
    this.selectedHotelId = id; // Store the selected hotel ID to show the view property component
    console.log("on view the stored id is : ", id);
  }

  onBack() {
    this.selectedHotelId = null; // Go back to the hotel list
  }
}
