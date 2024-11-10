export interface Booking {
  bookingId?: string;    // Changed to match the backend
  checkIn: Date;        // Change from Date to string if necessary
  checkOut: Date;       // Change from Date to string if necessary
  userId: string;       // New property
  hotelId: string;      // New property
  rooms: string[];       // New property
  transactionId?: string; // New property
  bookingDate?: Date;    // Change from Date to string if necessary
  status?: 'CONFIRMED' | 'CANCELLED' | 'PENDING' |'COMPLETED'; // Match the enum values
  totalPrice: number;   // This should remain
  roomCategory: 'SINGLE' | 'DOUBLE'; // Match the enum values
  [key: string]: any; 
}
/*  */