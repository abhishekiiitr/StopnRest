package com.hotelService.exception;

public class HotelNotFoundException extends RuntimeException {
    
    private static final long serialVersionUID = 1L; // Unique identifier for serialization

    public HotelNotFoundException(String message) {
        super(message); // Pass the message to the superclass constructor
    }
}
