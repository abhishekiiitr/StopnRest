package com.hotelService.model;
import java.util.ArrayList;
import java.util.List;

public class Room {
    private String roomId;
    private boolean isBooked;   // option ..will remove later
    private List<BookingDates> bookingDatesList;

    public Room() {
        this.bookingDatesList = new ArrayList<>();
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean isBooked) {
        this.isBooked = isBooked;
    }

    public List<BookingDates> getBookingDatesList() {
        return bookingDatesList;
    }

    public void setBookingDatesList(List<BookingDates> bookingDatesList) {
        this.bookingDatesList = bookingDatesList;
    }

    public void addBookingDates(BookingDates bookingDates) {
        this.bookingDatesList.add(bookingDates);
    }
}
