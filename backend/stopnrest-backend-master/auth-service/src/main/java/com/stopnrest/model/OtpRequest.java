package com.stopnrest.model;

public class OtpRequest {

	private String email;
	private String otp;
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getOtp() {
		return otp;
	}
	public void setOtp(String otp) {
		this.otp = otp;
	}
	public OtpRequest(String email, String otp) {
		super();
		this.email = email;
		this.otp = otp;
	}
}
