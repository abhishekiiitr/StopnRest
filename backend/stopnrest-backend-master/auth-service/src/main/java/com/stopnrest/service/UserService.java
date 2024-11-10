package com.stopnrest.service;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.stopnrest.exceptions.OtpNotVerifiedException;
import com.stopnrest.exceptions.UserAlreadyExistsException;
import com.stopnrest.exceptions.UserNotFoundException;
import com.stopnrest.model.OtpRequest;
import com.stopnrest.model.UpdateProfile;
import com.stopnrest.model.User;
import com.stopnrest.repository.UserRepository;

@Service
public class UserService {
	@Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        try {
        	user.setOtp(generateOtp());
        	User u1=userRepository.save(user);
        	sendOtpEmail(user.getEmail(), user.getOtp()); // Send OTP after registration
            return u1;
        } catch (DataIntegrityViolationException ex) {
            if (ex.getCause() instanceof org.hibernate.exception.ConstraintViolationException) {
                throw new UserAlreadyExistsException("Email " + user.getEmail() + " is already in use.");
            }
            throw ex; // Rethrow if not a unique constraint violation
        }
    }
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(String id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID " + id));

        if (!user.getEmail().equals(userDetails.getEmail()) && userRepository.existsByEmail(userDetails.getEmail())) {
            throw new UserAlreadyExistsException("Email " + userDetails.getEmail() + " is already in use.");
        }

        user.setUserName(userDetails.getUserName());
        user.setEmail(userDetails.getEmail());
        user.setContact(userDetails.getContact());
        user.setPassword(userDetails.getPassword());
//        user.setRole(userDetails.getRole());
        user.setProfilePic(userDetails.getProfilePic());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with ID " + id);
        }
        userRepository.deleteById(id);
    }
     public User getUserByEmail(String email) {
    	 if(!userRepository.existsByEmail(email)) {
    		 throw new UserNotFoundException("User not found with email " + email);
    	 }
    	 return userRepository.findByEmail(email);
     }
     
     public User changePassword(String userId,String newpassword) {
    	 User user = userRepository.findById(userId)
                 .orElseThrow(() -> new UserNotFoundException("User not found with ID " + userId));
    	 BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
         String hashedPassword = passwordEncoder.encode(newpassword);
         user.setPassword(hashedPassword);
    	 return userRepository.save(user);
     }
     
     public User updateProfile(String id, UpdateProfile updateUser) {
    	    User user = userRepository.findById(id)
    	            .orElseThrow(() -> new UserNotFoundException("User not found with ID " + id));
    	    
    	    if (!user.getEmail().equals(updateUser.getEmail()) && userRepository.existsByEmail(updateUser.getEmail())) {
    	        throw new UserAlreadyExistsException("Email " + updateUser.getEmail() + " is already in use.");
    	    }

    	    user.setEmail(updateUser.getEmail());
    	    user.setContact(updateUser.getContact());
    	    user.setUserName(updateUser.getUserName());

    	    // Update profile picture if provided
    	    if (updateUser.getProfilePic() != null && !updateUser.getProfilePic().isEmpty()) {
    	        user.setProfilePic(updateUser.getProfilePic());
    	    }

    	    return userRepository.save(user);
    	}
     public String generateOtp() {
         return String.format("%04d", new Random().nextInt(10000));
     }
     @Autowired
     private RestTemplate restTemplate;

     private void sendOtpEmail(String email, String otp) {
         OtpRequest emailRequest = new OtpRequest(email, "Your OTP code: " + otp);
         try {
             restTemplate.postForEntity("http://localhost:4800/emails/send-otp", emailRequest, String.class);
         } catch (Exception e) {
             throw new RuntimeException("Failed to send OTP email", e);
         }
     }
     public boolean verifyOtp(String email, String otp) {
         User user = userRepository.findByEmail(email);
         if (user == null || !user.getOtp().equals(otp)) {
             return false;
         }

         user.setOtp(null); 
         user.setOtpVerified(true);
         userRepository.save(user);

         return true;
     }
     public boolean sendRegistrationMail(String email) {
         try {User user=userRepository.findByEmail(email);
        	 if(user.isOtpVerified()) {
             restTemplate.postForEntity("http://localhost:4800/emails/send-registration?email="+email,null, String.class);
             return true;
        	 }
        	 else {
        		 throw new UserNotFoundException("User with email id : "+email + "not found");
        	 }
        	 
         } catch (Exception e) {
             throw new RuntimeException("Failed to send registration confirmation email", e);
         }
     }
     public void forgotPassword(String email) {
    	 if(!userRepository.existsByEmail(email)) {
    		 throw new UserNotFoundException("User with email id : "+ email + "does not exist");
    	 }
    	 User user=userRepository.findByEmail(email);
    	 user.setOtp(generateOtp());
    	 user.setOtpVerified(false);
    	 userRepository.save(user);
    	 sendOtpEmail(email,user.getOtp());
     }
     public User resetPassword(String email,String newpassword) {
    	 User user = userRepository.findByEmail(email);
         if(userRepository.existsByEmail(email)) {        
	    	 if(user.isOtpVerified()) {
		    	 BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		         String hashedPassword = passwordEncoder.encode(newpassword);
		         user.setPassword(hashedPassword);
		    	 return userRepository.save(user);
	    	 }
	    	 else {
	    		 throw new OtpNotVerifiedException("Please Verify your OTP first");
	    	 }
         }else {
        	 throw new UserNotFoundException("User with email: " + email +" does not exist");
         }
     }

}
