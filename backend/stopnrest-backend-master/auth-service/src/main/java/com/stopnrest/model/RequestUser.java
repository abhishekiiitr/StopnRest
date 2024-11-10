package com.stopnrest.model;

public class RequestUser {
	private String fullName;
	private String email;
	private Long phoneNumber;
	private String password;
	private String role;
	
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Long getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(Long phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public RequestUser(String fullName, String email, Long phoneNumber, String password,String role) {
		super();
		this.fullName = fullName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.password = password;
		this.role=role;
	}
	public RequestUser() {
		super();
		// TODO Auto-generated constructor stub
	}
	

}
