package com.sr.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.Repository;

import com.sr.model.BookingRequest;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, String> { // Assuming 'Long' is the correct ID type
	Optional<BookingRequest> findById(String bookingId);
    // Fetch previous bookings by userId where checkInDate is before today
    @Query("SELECT b FROM BookingRequest b WHERE b.userId = :userId AND b.checkIn < CURRENT_DATE")
    List<BookingRequest> findPreviousBookingRequestByUserId(@Param("userId") String userId);

    // Fetch upcoming bookings by userId where checkInDate is today or in the future
    @Query("SELECT b FROM BookingRequest b WHERE b.userId = :userId AND b.checkIn >= CURRENT_DATE")
    List<BookingRequest> findUpcomingBookingRequestByUserId(@Param("userId") String userId);

    // Fetch all bookings for a specific user
    @Query("SELECT b FROM BookingRequest b WHERE b.userId = :userId")
    List<BookingRequest> findAllBooking(@Param("userId") String userId);
//
//    // Fetch all bookings
//    @Query("SELECT b FROM BookingRequest b")
//    List<BookingRequest> findBookings();
}
