package com.stopnrest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stopnrest.exceptions.OtpNotVerifiedException;
import com.stopnrest.model.AuthRequest;
import com.stopnrest.model.AuthResponse;
import com.stopnrest.model.OtpRequest;
import com.stopnrest.model.RequestUser;
import com.stopnrest.model.UpdateProfile;
import com.stopnrest.model.User;
import com.stopnrest.service.UserService;
import com.stopnrest.util.JwtUtil;

@RestController
@RequestMapping("auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
//        userService.deleteUser(id);
//        return ResponseEntity.noContent().build();
//    }

    @GetMapping("/check")
    public ResponseEntity<String> check(){
        return new ResponseEntity<>("working", HttpStatus.OK);
    }

    @PostMapping("/na/login")
    public ResponseEntity<AuthResponse> generateToken(@RequestBody AuthRequest authRequest) throws Exception {
    	User user=userService.getUserByEmail(authRequest.getEmail());
        try {
        	if(!user.isOtpVerified()) {
        		throw new OtpNotVerifiedException("otp not verified Please register again to verify your otp first");
        	}
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
        } catch (Exception ex) {
            logger.error("Error during authentication: {}", ex.getMessage());
            throw new Exception("Invalid username/password");
        }
        AuthResponse response=new AuthResponse();
        String jwt = jwtUtil.generateToken(authRequest.getEmail());
        String email = jwtUtil.extractUsername(jwt);
        User userDetails = userService.getUserByEmail(email);
        response.setToken(jwt);
        response.setUser(userDetails);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/na/register")
    public ResponseEntity<User> addUser(@RequestBody RequestUser requestUser) {

    	User user =new User();
    	user.setUserName(requestUser.getFullName());
    	user.setEmail(requestUser.getEmail());
    	user.setContact(requestUser.getPhoneNumber());
    	user.setPassword(requestUser.getPassword());
    	user.setRole(requestUser.getRole());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        
        User savedUser = userService.createUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        
    }
    @GetMapping("/get-email-from-token")
    public ResponseEntity<String> getEmailFromToken(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Extract the email using JwtUtil
        String email = jwtUtil.extractUsername(token);
        if (email != null) {
            return ResponseEntity.ok(email);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        
        // If user is found, return the user; otherwise, return a 404 Not Found
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    
//    @PostMapping("/test")
//    public ResponseEntity<String> test(@RequestBody User user){
//        return new ResponseEntity<>(user.toString(), HttpStatus.OK);
//    }
    
    @PutMapping("/editPassword/{id}")
    public ResponseEntity<User> editPassword(@PathVariable String id, @RequestParam String password) {
        User updatedUser = userService.changePassword(id, password);
        return ResponseEntity.ok(updatedUser);
    }
    @PutMapping("/editProfile/{id}")
    public ResponseEntity<User> editProfile(@PathVariable String id, @RequestBody UpdateProfile profileDetail) {
        User updatedUser = userService.updateProfile(id, profileDetail);
        return ResponseEntity.ok(updatedUser);
    }
    @PostMapping("/na/verify-otp")
    public ResponseEntity<Map<String, Boolean>> verifyOtp(@RequestBody OtpRequest otpRequest) {
        boolean isOtpValid = userService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());
        Map<String, Boolean> response = new HashMap<>();
        
        response.put("verified", isOtpValid ? true : false);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/na/send-registration")
    public ResponseEntity<Map<String,Boolean>> sendRegistration(@RequestParam String email ){
    	boolean isRegistered= userService.sendRegistrationMail(email);
    	Map<String,Boolean> response=new HashMap<>();
    	response.put("Registered",isRegistered? true :false);
    	return ResponseEntity.ok(response);
    }
    @PostMapping("/na/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            userService.forgotPassword(email);
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while sending OTP: " + e.getMessage());
        }
    }
    @PutMapping("/na/reset-password")
    public ResponseEntity<User> resetPassword(@RequestParam String password,@RequestParam String email) {
        User updatedUser = userService.resetPassword(email,password);
        return ResponseEntity.ok(updatedUser);
    }
    
}
