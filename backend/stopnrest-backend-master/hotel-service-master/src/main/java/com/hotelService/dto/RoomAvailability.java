package com.hotelService.dto;

import java.util.List;

public class RoomAvailability {
    private int availableCount;
    private List<String> availableRoomIds;
    private double pricePerNight;

    // Getters and setters
    public int getAvailableCount() {
        return availableCount;
    }

    public void setAvailableCount(int availableCount) {
        this.availableCount = availableCount;
    }

    public List<String> getAvailableRoomIds() {
        return availableRoomIds;
    }

    public void setAvailableRoomIds(List<String> availableRoomIds) {
        this.availableRoomIds = availableRoomIds;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }
}
