package com.sr.controller;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.apache.catalina.Server;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.sr.exception.BookingNotFoundException;
import com.sr.exception.UserNotFoundException;
import com.sr.model.*;
import com.sr.model.BookingRequest.BookingStatus;
import com.sr.model.BookingRequest.RoomCategory;
import com.sr.service.BookingService;
import com.sr.service.TransactionService;

@RestController
@RequestMapping("/bookings")
public class BookingController {

	@Autowired
	private BookingService service;

	@Autowired
	private RestTemplate template;

	@Autowired
	private TransactionService transactionService;
//	@GetMapping
//	public List<Bookings> getAllBookings() {
//		return service.getEveryBookings();
//	}//test

	@GetMapping
	public ResponseEntity<Map<String, Object>> getBookingsForUser(@RequestParam String userId) {
		try {
			Map<String, Object> bookings = service.getBookingsByUserId(userId);
			return ResponseEntity.ok(bookings);
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "An error occurred while fetching bookings."));
		}
	}

	@GetMapping("/find")
	public BookingRequest getBookingsByBid(@RequestParam(value = "bookingId") String bookingId) {

		BookingRequest book = service.getBookings(bookingId);

		return book;
	}

//	@PostMapping("/booknow")
//	public ResponseEntity<String> createBooking(@RequestBody BookingRequest booking) {
//		BookingRequest savedBooking = service.createBookingWithTransaction(booking);
//
//		// Prepare parameters for updating room availability
//		String bookingId = savedBooking.getBookingId();
//		String hotelId = savedBooking.getHotelId();
//		RoomCategory roomCategory = savedBooking.getRoomCategory();
//		List<String> roomIds = savedBooking.getRooms();
//		boolean increase = false; // This will be false when you are booking rooms
//		Date checkInD = savedBooking.getCheckIn();
//		Date checkOutD = savedBooking.getCheckOut();
//
//		// Format the check-in and check-out dates to 'yyyy-MM-dd'
//		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//		String checkIn = dateFormat.format(checkInD);
//		String checkOut = dateFormat.format(checkOutD);
//		
//		
//		
//		// String url = "http://hotel-service/update-room-availability";
//		String url = "http://hotel-service/api/v1/hotels/update-room-availability/" + booking.getHotelId()
//				+ "?roomCategory=" + roomCategory + "&increase=" + increase + "&roomIds=" + roomIds + "&checkInDate="
//				+ checkIn + "&checkOutDate=" + checkOut + "&bookingId=" + bookingId;
//
//		 
//		// return template.postForEntity(completeUrl, null, String.class);
//		return template.postForEntity(url, null, String.class);
//	}

	@PostMapping("/booknow")
	public ResponseEntity<Map<String, Object>> createBooking(@RequestBody BookingRequest booking) {
	    // Perform the booking logic
	    BookingRequest savedBooking = service.createBookingWithTransaction(booking);
	    
	    // Prepare parameters for updating room availability
	    String bookingId = savedBooking.getBookingId();
	    String hotelId = savedBooking.getHotelId();
	    RoomCategory roomCategory = savedBooking.getRoomCategory();
	    List<String> roomIds = savedBooking.getRooms();
	    boolean increase = false; // This will be false when you are booking rooms
	    Date checkInD = savedBooking.getCheckIn();
	    Date checkOutD = savedBooking.getCheckOut();
	    
	    // Prepare the request body for updating room availability
	    Map<String, Object> requestBody = new HashMap<>();
	    requestBody.put("hotelId", hotelId);
	    requestBody.put("roomCategory", roomCategory);
	    requestBody.put("increase", increase);
	    requestBody.put("roomIds", roomIds);
	    requestBody.put("checkInDate", checkInD);
	    requestBody.put("checkOutDate", checkOutD);
	    requestBody.put("bookingId", bookingId);

	    // Call the update room availability service
	    String url = "http://hotel-service/api/v1/hotels/update-room-availability";
	    ResponseEntity<String> responseEntity = template.postForEntity(url, requestBody, String.class);

	    // Check the response status from the update room availability service
	    if (responseEntity.getStatusCode() == HttpStatus.OK) {
	        // Prepare the success response
	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("status", "success");
	        responseBody.put("message", "Booking created successfully");
	        responseBody.put("bookingId", bookingId);
	        return ResponseEntity.ok(responseBody);
	    } else {
	        // Prepare the error response
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("status", "failure");
	        errorResponse.put("message", "Failed to update room availability");
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	    }
	}



	@PutMapping("/cancel/{bookingId}")
	public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable String bookingId) {
	    // Cancel the booking
	    BookingRequest savedBooking = service.cancelBooking(bookingId);
	    
	    // Prepare parameters for updating room availability
	    String hotelId = savedBooking.getHotelId();
	    RoomCategory roomCategory = savedBooking.getRoomCategory();
	    List<String> roomIds = savedBooking.getRooms();
	    boolean increase = true; // This will be true when you are cancelling rooms
	    Date checkInD = savedBooking.getCheckIn();
	    Date checkOutD = savedBooking.getCheckOut();

	    // Prepare the request body for updating room availability
	    Map<String, Object> requestBody = new HashMap<>();
	    requestBody.put("hotelId", hotelId);
	    requestBody.put("roomCategory", roomCategory);
	    requestBody.put("increase", increase);
	    requestBody.put("roomIds", roomIds);
	    requestBody.put("checkInDate", checkInD);
	    requestBody.put("checkOutDate", checkOutD);
	    requestBody.put("bookingId", bookingId);

	    // Call the update room availability service
	    String url = "http://hotel-service/api/v1/hotels/update-room-availability";
	    ResponseEntity<String> responseEntity = template.postForEntity(url, requestBody, String.class);

	    // Check the response status from the update room availability service
	    if (responseEntity.getStatusCode() == HttpStatus.OK) {
	        // Prepare the success response
	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("status", "success");
	        responseBody.put("message", "Booking cancelled successfully");
	        responseBody.put("bookingId", bookingId);
	        return ResponseEntity.ok(responseBody);
	    } else {
	        // Prepare the error response
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("status", "failure");
	        errorResponse.put("message", "Failed to update room availability");
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	    }
	}

	
	
//	@PutMapping("/cancel/{bookingId}")
//	public ResponseEntity<String> cancelBooking(@PathVariable String bookingId) {
//
//		BookingRequest savedBooking = service.cancelBooking(bookingId);
//		// String bookingId = savedBooking.getBookingId();
//		String hotelId = savedBooking.getHotelId();
//		RoomCategory roomCategory = savedBooking.getRoomCategory();
//		List<String> roomIds = savedBooking.getRooms();
//		boolean increase = false; // This will be false when you are booking rooms
//		Date checkInD = savedBooking.getCheckIn();
//		Date checkOutD = savedBooking.getCheckOut();
//
//		// Format the check-in and check-out dates to 'yyyy-MM-dd'
//		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//		String checkIn = dateFormat.format(checkInD);
//		String checkOut = dateFormat.format(checkOutD);
//		
//		
//		 
//
//		// String url = "http://hotel-service/update-room-availability";
//		String url = "http://hotel-service/api/v1/hotels/update-room-availability/" + hotelId
//				+ "?roomCategory=" + roomCategory + "&increase=" + increase + "&roomIds=" + roomIds + "&checkInDate="
//				+ checkIn + "&checkOutDate=" + checkOut + "&bookingId=" + bookingId;
//
//		 
//
//		// return template.postForEntity(completeUrl, null, String.class);
//		return template.postForEntity(url, null, String.class);
//
//	}
}
