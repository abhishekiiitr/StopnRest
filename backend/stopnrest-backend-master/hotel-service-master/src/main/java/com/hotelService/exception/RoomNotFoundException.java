package com.hotelService.exception;

public class RoomNotFoundException extends RuntimeException {
    
    private static final long serialVersionUID = 1L; // Unique identifier for serialization

    public RoomNotFoundException(String message) {
        super(message); // Pass the message to the superclass constructor
    }
}
