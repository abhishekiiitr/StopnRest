package com.hotelService.dto;

import java.util.Date;
import java.util.List;

import com.hotelService.model.RoomType.RoomCategory;

public class UpdateRoomAvailabilityRequest {
    private String hotelId;
    private RoomCategory roomCategory;
    private boolean increase;
    private List<String> roomIds;
    private Date checkInDate;
    private Date checkOutDate;
    private String bookingId;

    // Getters and Setters
    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }

    public RoomCategory getRoomCategory() { return roomCategory; }
    public void setRoomCategory(RoomCategory roomCategory) { this.roomCategory = roomCategory; }

    public boolean isIncrease() { return increase; }
    public void setIncrease(boolean increase) { this.increase = increase; }

    public List<String> getRoomIds() { return roomIds; }
    public void setRoomIds(List<String> roomIds) { this.roomIds = roomIds; }

    public Date getCheckInDate() { return checkInDate; }
    public void setCheckInDate(Date checkInDate) { this.checkInDate = checkInDate; }

    public Date getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(Date checkOutDate) { this.checkOutDate = checkOutDate; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
}

