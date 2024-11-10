package com.sr.service;

import java.util.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.sr.repo.*;
import com.sr.exception.BookingNotFoundException;
import com.sr.exception.UserNotFoundException;
import com.sr.model.*;
import com.sr.model.BookingRequest.*;

@Service
public class BookingService {

	@Autowired
	private BookingRequestRepository bookingRepo;

	@Autowired
	private RestTemplate restTemplate;

	public BookingRequest getBookings(String id) {
		return bookingRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Bookings with ID " + id + " not found"));
	}
	public Map<String, Object> getBookingsByUserId(String userId) {
	    // Fetch previous and upcoming bookings for the user
		System.out.println("Received userId: " + userId);

	    List<BookingRequest> previousBookings = bookingRepo.findPreviousBookingRequestByUserId(userId);
	    List<BookingRequest> upcomingBookings = bookingRepo.findUpcomingBookingRequestByUserId(userId);

	    

	    // Prepare the response map
	    Map<String, Object> response = new HashMap<>();
	    response.put("previousBookings", previousBookings.isEmpty() ? new ArrayList<>() : previousBookings);
	    response.put("upcomingBookings", upcomingBookings.isEmpty() ? new ArrayList<>() : upcomingBookings);
	    
	    return response;
	}
 
	

	

	public BookingRequest createBookings(BookingRequest book) {
		book.setStatus(BookingStatus.PENDING);
		BookingRequest savedBooking = bookingRepo.save(book);

		return savedBooking;
	}

	@Autowired
	private TransactionRepository transactionRepository;


	public void updateBookingStatus(String bookingId, BookingStatus status) {
		BookingRequest booking = bookingRepo.findById(bookingId)
				.orElseThrow(() -> new RuntimeException("Booking with " + bookingId + "not found"));
		booking.setStatus(status);
		bookingRepo.save(booking);
	}

	public BookingRequest cancelBooking(String bookingId) {
		BookingRequest booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking with " + bookingId + "not found"));;//.orElseThrow(() -> new RuntimeException("Booking with " + bookingId + "not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);
        return booking;// Save the updated booking and return it
    }



	public BookingRequest createBookingWithTransaction(BookingRequest request) {
			request.setStatus(BookingStatus.PENDING);
	    	BookingRequest booking = new BookingRequest();
	        booking.setHotelId(request.getHotelId());
	        booking.setUserId(request.getUserId());
			booking.setTransactionId(UUID.randomUUID().toString());
	        booking.setTotalPrice(request.getTotalPrice());
	        booking.setCheckIn(request.getCheckIn());
	        booking.setCheckOut(request.getCheckOut());
	        booking.setRoomCategory(request.getRoomCategory());
	        booking.setStatus(BookingStatus.PENDING);	         
	        booking.setRooms(request.getRooms());
	        // Update room availability in hotel service	      
	        BookingRequest saved=bookingRepo.save(booking);
	        Transaction transaction = new Transaction();
			transaction.setTransactionId(saved.getTransactionId());
			transaction.setBookingId(booking.getBookingId());
			transaction.setTotalPrice(booking.getTotalPrice()); // Assuming you need an amount field
			transaction.setStatus(Transaction.Status.PENDING); // Set initial status if required
			transactionRepository.save(transaction);
			BookingRequest done= processTransaction(transaction.getTransactionId(),"SUCCESS");
			//updateRoomAvailability(done.getHotelId(),done.getRoomCategory(),false,done.getRooms(),done.getCheckIn(),done.getCheckOut(),done.getBookingId());
            
	    return done;
	}

	 
	public BookingRequest processTransaction(String id, String status) {
		// Save the transaction in the database
		 
		Transaction savedTransaction = transactionRepository.findTransactionById(id);
		savedTransaction.setStatus(Transaction.Status.valueOf(status));
		 
		BookingRequest booking = bookingRepo.getById(savedTransaction.getBookingId());
		
		if (savedTransaction.getStatus() == Transaction.Status.SUCCESS) {
			booking.setStatus(BookingRequest.BookingStatus.CONFIRMED);
			bookingRepo.save(booking);
			//
       		}

		return booking;
	}
	 
}