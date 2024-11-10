package com.example.allthreeapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class SuccessService {

    private final JavaMailSender mailSender;
    private final Map<String, String> otpStorage = new HashMap<>();

    @Autowired
    public SuccessService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // sending simple Email (for registration success and other basic emails)
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("johncenaxxx082@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        System.out.println("Simple email sent successfully to " + toEmail);
    }

    // send registration success Email
    public void sendRegistrationEmail(String toEmail) throws IOException, MessagingException {
        String subject = "Stop & Rest - Registration Successful";
        String body = loadTemplate("/home/zadmin/Desktop/microservices-stopNrest/allthreeapi/src/main/resources/templates/registration-success.html");
        sendHtmlEmail(toEmail, subject, body);
    }

    public void sendOtpEmail(String toEmail, String otp) throws IOException {
        otpStorage.put(toEmail, otp);
        String subject = "OTP Verification";
        String body = loadTemplate("/home/zadmin/Desktop/microservices-stopNrest/allthreeapi/src/main/resources/templates/otp-verification.html").replace("${otp}", otp);
        try {
            sendHtmlEmail(toEmail, subject, body);
        } catch (MessagingException e) {
            System.err.println("Error sending OTP email: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String otp) {
        if (otpStorage.containsKey(email)) {
            String storedOtp = otpStorage.get(email);
            return storedOtp.equals(otp);
        }
        return false;
    }

    // send Email with attchment (for favorite notifications)
    public void sendEmailWithAttachment(String toEmail, String itemName, String screenshotPath) throws MessagingException, IOException {
        String subject = "Favorites Added - " + itemName;
        String body = loadTemplate("/home/zadmin/Downloads/allthreeapi/src/main/resources/templates/favourites-notification.html").replace("${itemName}", itemName);
        sendHtmlEmailWithAttachment(toEmail, subject, body, screenshotPath);
    }

    private void sendHtmlEmail(String toEmail, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("johncenaxxx082@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body, true); // Set to true to indicate HTML
        mailSender.send(message);
        System.out.println("HTML email sent successfully to " + toEmail);
    }

    private void sendHtmlEmailWithAttachment(String toEmail, String subject, String body, String screenshotPath) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("johncenaxxx082@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body, true); // Set to true to indicate HTML

        // attach the screenshot
        FileSystemResource file = new FileSystemResource(screenshotPath);
        helper.addAttachment("screenshot.png", file);

        mailSender.send(message);
        System.out.println("Email with attachment sent successfully to " + toEmail);
    }

    private String loadTemplate(String filePath) throws IOException {
        return new String(Files.readAllBytes(Path.of(filePath)));
    }
}
