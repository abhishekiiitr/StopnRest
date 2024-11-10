package com.hotelService.controller;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.hotelService.dto.*;
import com.hotelService.model.Hotel;
import com.hotelService.model.RoomType;
import com.hotelService.model.RoomType.RoomCategory;
import com.hotelService.service.HotelService;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/api/v1/hotels")
public class HotelController {
	@Autowired
    private HotelService hotelService;
	
	@GetMapping
	public ResponseEntity<List<Hotel>> getHotels (){
		List<Hotel> hotels = hotelService.getHotels();
		return ResponseEntity.ok(hotels);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Optional<Hotel>> getById (@PathVariable String id){
		Optional<Hotel> hotel = hotelService.getHotelsById(id);
		return ResponseEntity.ok(hotel);
	}
	
	@GetMapping("/owner/{owner_id}")
    public ResponseEntity<List<Hotel>> getHotelsByOwnerID(@PathVariable String owner_id) {
        List<Hotel> hotels = hotelService.getHotelsByOwnerID(owner_id);
        if (hotels.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(hotels, HttpStatus.OK);
    }
	
	@PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        Hotel createdHotel = hotelService.createHotel(hotel);
        return new ResponseEntity<>(createdHotel, HttpStatus.CREATED);
    }
	
	@GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam String city) {
        List<Hotel> hotels = hotelService.searchHotelsByLocation(city);
        return ResponseEntity.ok(hotels);
    }
	
	@GetMapping("/filter")
	public ResponseEntity<List<HotelAvailability>> filterHotels(
	        @RequestParam String city, 
	        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date checkIn, 
	        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date checkOut,
	        @RequestParam(required = false) RoomType.RoomCategory category) {

	    List<HotelAvailability> hotels = hotelService.getAvailableHotels(city, checkIn, checkOut, category);
	    return new ResponseEntity<>(hotels, HttpStatus.OK);
	}

	 @DeleteMapping("/{hotelId}")
    public ResponseEntity<String> deleteHotel(@PathVariable String hotelId) {
        hotelService.deleteHotel(hotelId);
        return ResponseEntity.ok("Hotel with ID " + hotelId + " has been deleted.");
   }
	 
	@PatchMapping("/{hotelId}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable String hotelId, @RequestBody Hotel hotel) {
        Hotel updatedHotel = hotelService.updateHotel(hotelId, hotel);
        return ResponseEntity.ok(updatedHotel);
	}
	
//	@PostMapping("/update-room-availability/{hotelId}")
//	public ResponseEntity<String> updateRoomAvailability(
//	        @PathVariable String hotelId,
//	        @RequestParam RoomCategory roomCategory,
//	        @RequestParam boolean increase,
//	        @RequestParam List<String> roomIds,
//	        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date checkInDate,
//	        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date checkOutDate,
//	        @RequestParam String bookingId
//	) {
//	    boolean success = true;
//	    for (String roomId : roomIds) {
//	        boolean roomSuccess = hotelService.updateRoomAvailability(hotelId, roomCategory, increase, roomId, checkInDate, checkOutDate, bookingId);
//	        System.out.println("Status of the booking for room is "+roomId+" is : "+roomSuccess);
//	        if (!roomSuccess) {
//	            success = false;
//	            break;
//	        }
//	    }
//	    
//	    if (success) {
//	        return ResponseEntity.ok("Room availability updated successfully for all rooms");
//	    } else {
//	        return ResponseEntity.status(400).body("Failed to update room availability for one or more rooms");
//	    }
//	}
	
	@PostMapping("/update-room-availability")
	public ResponseEntity<String> updateRoomAvailability(@RequestBody UpdateRoomAvailabilityRequest request) {
	    String hotelId = request.getHotelId();
	    RoomCategory roomCategory = request.getRoomCategory();
	    boolean increase = request.isIncrease();
	    List<String> roomIds = request.getRoomIds();
	    Date checkInDate = request.getCheckInDate();
	    Date checkOutDate = request.getCheckOutDate();
	    String bookingId = request.getBookingId();

	    boolean overallSuccess = true; // To track the overall success of the operation

	    // Iterate through each roomId and update its availability
	    for (String roomId : roomIds) {
	        boolean roomSuccess = hotelService.updateRoomAvailability(hotelId, roomCategory, increase, roomId, checkInDate, checkOutDate, bookingId);
	        System.out.println("Status of the booking for room " + roomId + ": " + roomSuccess);
	        System.out.println("INside hotel controller step 2 in rooms loop" + roomId);
	        // If any room update fails, set overallSuccess to false
	        if (!roomSuccess) {
	            overallSuccess = false;
	        }
	    }

	    // Return response based on the success of the operation
	    if (overallSuccess) {
	        return ResponseEntity.ok("Room availability updated successfully for all rooms.");
	    } else {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update room availability for one or more rooms.");
	    }
	}

}
	
	
	