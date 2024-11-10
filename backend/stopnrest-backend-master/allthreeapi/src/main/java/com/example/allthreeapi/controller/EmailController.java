package com.example.allthreeapi.controller;

import com.example.allthreeapi.model.EmailAuth;
import com.example.allthreeapi.service.SuccessService;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("emails")
public class EmailController {

    private final SuccessService successService;

    @Autowired
    public EmailController(SuccessService successService) {
        this.successService = successService;
    }

    // registration success Email
    @PostMapping("/send-registration")
    public ResponseEntity<String> sendRegistrationEmail(@RequestParam String email) {
        try {
            successService.sendRegistrationEmail(email);
            return ResponseEntity.ok("Registration email sent successfully to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending registration email: " + e.getMessage());
        }
    }

    // OTP email
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtpEmail(@RequestBody EmailAuth auth) {
        try {
            successService.sendOtpEmail(auth.getEmail(), auth.getOtp());
            return ResponseEntity.ok("OTP sent successfully to " + auth.getEmail());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isVerified = successService.verifyOtp(email, otp);
        if (isVerified) {
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP or email.");
        }
    }

    // favourite notification email with ss(screenshot)
    @PostMapping("/send-favorite-notification")
    public ResponseEntity<String> sendFavoriteNotification(@RequestParam String email, @RequestParam String itemName, @RequestParam String screenshotPath) {
        try {
            successService.sendEmailWithAttachment(email, itemName, screenshotPath);
            return ResponseEntity.ok("Favorite notification email sent successfully to " + email);
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error sending email with attachment: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error loading email template: " + e.getMessage());
        }
    }
}
