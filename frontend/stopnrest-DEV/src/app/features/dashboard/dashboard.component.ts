import { Component, OnInit } from '@angular/core';
import { HotelService } from 'src/app/core/service/hotel/hotel.service';
import { Hotel, HotelSearchResponse } from 'src/app/shared/models/hotel.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent {
  searchParams: any = {};
  selectedPlace: string = '';
  showSearchResult: boolean = false;
  hotels: Hotel[] = [];
  responseHotel: HotelSearchResponse [] = [];
  isSearched: boolean = false;
  isDatesProvided: boolean = false;
  constructor(private hotelService: HotelService,  private datePipe: DatePipe) {}

  onSearch(event: any) {
    this.searchParams = event;
    this.showSearchResult = true;
    this.isDatesProvided = event.checkIn && event.checkOut;
    
    if (this.searchParams.checkIn && this.searchParams.checkOut) {
      this.filterHotels();
    } else {
      this.searchByCity(this.searchParams.location);
    }
  }

  onPlaceSelected(placeName: string) {
    this.selectedPlace = placeName;
    this.searchByCity(placeName);
  }

  filterHotels() {
    const checkIn = this.datePipe.transform(this.searchParams.checkIn, 'yyyy-MM-dd');
    const checkOut = this.datePipe.transform(this.searchParams.checkOut, 'yyyy-MM-dd');
    
    this.hotelService.filterHotels(
      this.searchParams.location,
      new Date(checkIn || ''),
      new Date(checkOut || ''),
      this.searchParams.category
    ).subscribe(
      (filteredHotels: HotelSearchResponse[]) => {
        this.responseHotel = filteredHotels;
        this.showSearchResult = true;
        this.isSearched = true;
      },
      error => {
        console.error('Error filtering hotels:', error);
      }
    );
  }
  

  searchByCity(city: string) {
    this.hotelService.getByCity(city).subscribe(
      (cityHotels: Hotel[]) => {
        this.hotels = cityHotels;
        this.showSearchResult = true;
        this.selectedPlace = city;
        this.isSearched = false;
      },
      error => {
        console.error('Error fetching hotels by city:', error);
      }
    );
  }
}