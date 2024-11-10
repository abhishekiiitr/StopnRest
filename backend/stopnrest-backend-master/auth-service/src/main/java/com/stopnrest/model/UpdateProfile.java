package com.stopnrest.model;

public class UpdateProfile {

    private String userName;
    private String email;
    private Long contact;
    private String profilePic;  // New field for profile picture

    public UpdateProfile() {
        super();
    }

    public UpdateProfile(String userName, String email, Long contact, String profilePic) {
        super();
        this.userName = userName;
        this.email = email;
        this.contact = contact;
        this.profilePic = profilePic;
    }

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getContact() {
		return contact;
	}

	public void setContact(Long contact) {
		this.contact = contact;
	}

	public String getProfilePic() {
		return profilePic;
	}

	public void setProfilePic(String profilePic) {
		this.profilePic = profilePic;
	}

    
}
