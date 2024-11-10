package com.hotelService.model;

import java.util.ArrayList;
import java.util.List;

public class RoomType {

    public enum RoomCategory {
        SINGLE, DOUBLE
    }

    private RoomCategory roomCategory;
    private double pricePerRoom;
    private int totalRooms;
    private int availableRooms;
    private List<String> amenities;
    private List<String> images;
    private List<Room> rooms;

    // Getters and Setters
    
    public RoomType() {
        this.rooms = new ArrayList<>(); // Initialize the rooms list
        this.amenities = new ArrayList<>(); // Initialize amenities list
    }
    
    public List<Room> getRooms() {
		return rooms;
	}

	public void setRooms(List<Room> rooms) {
		this.rooms = rooms;
	}

	public RoomCategory getRoomCategory() {
        return roomCategory;
    }

    public void setRoomCategory(RoomCategory roomCategory) {
        this.roomCategory = roomCategory;
    }

    public double getPricePerRoom() {
        return pricePerRoom;
    }

    public void setPricePerRoom(double pricePerRoom) {
        this.pricePerRoom = pricePerRoom;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
