package com.sr.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.GenericGenerator;

 
@Entity
public class BookingRequest {

	@Id 
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2") // Use uuid2 strategy    
	@Column(name = "booking_id", unique = true)
    private String bookingId;

    @Column(name = "hotel_id", nullable = false)
    private String hotelId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name="transaction_id")
    private String transactionId;
    
    @Column(name = "check_in", nullable = false)
    private Date checkIn;

    @Column(name = "check_out", nullable = false)
    private Date checkOut;

    @Column(name = "booking_date", nullable = false, updatable = false)
    private Date bookingDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "room_category", nullable = false)
    private RoomCategory roomCategory;
    
    
    private List<String> rooms;
    
    @PrePersist
    protected void onCreate() {
        this.bookingDate =new Date(); // Set booking_date to current timestamp
        
    }
    

    public String getBookingId() {
		return bookingId;
	}


	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}


	public String getUserId() {
		return userId;
	}


	public void setUserId(String userId) {
		this.userId = userId;
	}


	public String getTransactionId() {
		return transactionId;
	}


	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}


	public Date getBookingDate() {
		return bookingDate;
	}


	public void setBookingDate(Date bookingDate) {
		this.bookingDate = bookingDate;
	}


	public BookingStatus getStatus() {
		return status;
	}


	public void setStatus(BookingStatus status) {
		this.status = status;
	}


	public Double getTotalPrice() {
		return totalPrice;
	}


	public void setTotalPrice(Double totalPrice) {
		this.totalPrice = totalPrice;
	}


	public RoomCategory getRoomCategory() {
		return roomCategory;
	}


	public void setRoomCategory(RoomCategory roomCategory) {
		this.roomCategory = roomCategory;
	}


	// Getters and Setters
    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public List<String> getRooms() {
        return rooms;
    }

    public void setRooms(List<String> rooms) {
        this.rooms = rooms;
    }
    
    public Date getCheckIn() {
		return checkIn;
	}


	public void setCheckIn(Date checkIn) {
		this.checkIn = checkIn;
	}


	public Date getCheckOut() {
		return checkOut;
	}


	public void setCheckOut(Date checkOut) {
		this.checkOut = checkOut;
	}



	public enum BookingStatus {
        CONFIRMED,
        CANCELLED,
        PENDING,
        COMPLETED
    }
    public enum RoomCategory {
        SINGLE, DOUBLE
    }
	@Override
	public String toString() {
		return "BookingRequest [bookingId=" + bookingId + ", hotelId=" + hotelId + ", userId=" + userId
				+ ", transactionId=" + transactionId + ", checkIn=" + checkIn + ", checkOut=" + checkOut
				+ ", bookingDate=" + bookingDate + ", status=" + status + ", totalPrice=" + totalPrice
				+ ", roomCategory=" + roomCategory + ", rooms=" + rooms + ", getBookingId()=" + getBookingId()
				+ ", getUserId()=" + getUserId() + ", getTransactionId()=" + getTransactionId() + ", getBookingDate()="
				+ getBookingDate() + ", getStatus()=" + getStatus() + ", getTotalPrice()=" + getTotalPrice()
				+ ", getRoomCategory()=" + getRoomCategory() + ", getHotelId()=" + getHotelId() + ", getRooms()="
				+ getRooms() + ", getCheckIn()=" + getCheckIn() + ", getCheckOut()=" + getCheckOut() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}
    
    
    
}
