package com.sr.model; 

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Transaction {
	@Id 
	private String transactionId;

	@Column(name="booking_id" )
	private String bookingId;
	
	@Column(name = "total_price", nullable = false)
    private Double totalPrice;
	
	private Status status; // e.g., "SUCCESS", "FAILED"
	
	 
	@Column(name="transaction_date")
	private LocalDateTime transactionDate;

	public enum Status {
		SUCCESS, FAILED, PENDING
	}

	@PrePersist
    protected void onCreate() {
        this.transactionDate = LocalDateTime.now(); // Set booking_date to current timestamp
        
    }

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public String getBookingId() {
		return bookingId;
	}
	
	 

	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}

	public Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	 
	public LocalDateTime getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(LocalDateTime transactionDate) {
		this.transactionDate = transactionDate;
	}
	
}
