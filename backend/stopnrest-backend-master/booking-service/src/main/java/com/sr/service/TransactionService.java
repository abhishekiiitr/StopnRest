package com.sr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import com.sr.model.BookingRequest;
import com.sr.model.Transaction;
import com.sr.repo.TransactionRepository;

@Service
public class TransactionService {
	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private BookingService bookingService;
	
	public Transaction processTransaction(String id, String status) {
		// Save the transaction in the database
		 
		Transaction savedTransaction = transactionRepository.findTransactionById(id);
		savedTransaction.setStatus(Transaction.Status.valueOf(status));
		// If transaction is SUCCESS, update the booking status
		if (savedTransaction.getStatus() == Transaction.Status.SUCCESS) {
			BookingRequest booking = bookingService.getBookings(savedTransaction.getBookingId());
			booking.setStatus(BookingRequest.BookingStatus.CONFIRMED);
			//bookingRepo.save(booking);
            // Call to update room availability after confirmation
            //bookingService.updateRoomAvailability(booking,false);
       		}

		return savedTransaction;
	}

	 
}
