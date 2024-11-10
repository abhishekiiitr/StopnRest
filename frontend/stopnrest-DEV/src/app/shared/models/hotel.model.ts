export interface RoomType {
    roomCategory: string;
    pricePerRoom: number;
    totalRooms: number;
    availableRooms: number;
    amenities: string[];
    images: string[];
    rooms: Room[];
  }
  
  export interface Room {
    roomId: string;
    bookingDatesList:BookingDates[];
  }

  export interface BookingDates{
    BookingID: string;
    checkIn: Date;
    checkOut: Date;
  }

  export interface Hotel {
    hotel_id: string;
    name: string;
    location: {
      city: string;
    };
    description: string;
    owner_id: string;
    total_room: number;
    roomTypes: RoomType[];
    images: string[];
    ratings: number[];
  }

  export interface HotelSearchResponse {
    hotelId: string;
    hotelName: string;
    images: string[];
    city: string;
    description: string;
    roomAvailability: {
      SINGLE?: RoomAvailability;
      DOUBLE?: RoomAvailability;
    };
  }
  
  export interface RoomAvailability {
    availableCount: number;
    availableRoomIds: string[];
    pricePerNight: number;
  }
  
  