import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel, HotelSearchResponse } from 'src/app/shared/models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private api_uri = 'http://localhost:1111/api/v1/hotels';
  
  constructor(private http: HttpClient) { }

  // Fetch userId from localStorage
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Fetch all hotels
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.api_uri);
  }

  // Fetch hotel by ID
  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.api_uri}/${id}`);
  }

  // Filter hotels based on criteria (city, check-in, check-out, category)
  filterHotels(city: string, checkIn?: Date, checkOut?: Date, category?: string): Observable<HotelSearchResponse[]> {
    let url = `${this.api_uri}/filter?city=${city}`;
    
    // Formatting dates
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    if (checkIn) url += `&checkIn=${formatDate(checkIn)}`;
    if (checkOut) url += `&checkOut=${formatDate(checkOut)}`;
    if (category) url += `&category=${category}`;

    return this.http.get<HotelSearchResponse[]>(url);
  }

  // Search hotels by city
  getByCity(city: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.api_uri}/search?city=${city}`);
  }

  // Create a new hotel
  createHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.api_uri, hotel);
  }

  // Update an existing hotel by ID
  updateHotel(hotelId: string, updatedHotel: Hotel): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.api_uri}/${hotelId}`, updatedHotel);
  }

  // Delete a hotel by ID
  deleteHotel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api_uri}/${id}`);
  }

  // Fetch hotels by owner ID (My Properties feature)
  findHotelByOwnerId(): Observable<Hotel[]> {
    const userId = this.getUserId();  // Get userId from localStorage
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    
    return this.http.get<Hotel[]>(`${this.api_uri}/owner/${userId}`);
  }

  // Fetch hotels list for the logged-in user (My Properties)
  getHotelsListForUser(): Observable<Hotel[]> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.get<Hotel[]>(`${this.api_uri}/user/${userId}`);
    } else {
      throw new Error('User ID not found in localStorage');
    }
  }

  // Filter hotels based on city, checkIn, checkOut for a specific user
  filterHotelsForUser(city: string, checkIn?: Date, checkOut?: Date, category?: string): Observable<HotelSearchResponse[]> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }

    let url = `${this.api_uri}/user/${userId}/filter?city=${city}`;
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (checkIn) url += `&checkIn=${formatDate(checkIn)}`;
    if (checkOut) url += `&checkOut=${formatDate(checkOut)}`;
    if (category) url += `&category=${category}`;

    return this.http.get<HotelSearchResponse[]>(url);
  }
}
