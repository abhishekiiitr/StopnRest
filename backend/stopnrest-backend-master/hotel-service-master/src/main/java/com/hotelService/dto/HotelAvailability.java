package com.hotelService.dto;
import java.util.List;
import java.util.Map;

import com.hotelService.model.RoomType;

public class HotelAvailability {
    private String hotelId;
    private String hotelName;
    private String city;
    private List<String> images;
    public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> list) {
		this.images = list;
	}

	private String description;  // New field for hotel description
    private Map<RoomType.RoomCategory, RoomAvailability> roomAvailability;

    // Getters and setters
    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Map<RoomType.RoomCategory, RoomAvailability> getRoomAvailability() {
        return roomAvailability;
    }

    public void setRoomAvailability(Map<RoomType.RoomCategory, RoomAvailability> roomAvailability) {
        this.roomAvailability = roomAvailability;
    }
}

