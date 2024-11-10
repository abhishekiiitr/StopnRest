package com.stopnrest.model;

public class AuthResponse {

	User user;
	String token;
	
	public AuthResponse(User user, String token) {
		super();
		this.user = user;
		this.token = token;
	}
	
	public AuthResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
}
