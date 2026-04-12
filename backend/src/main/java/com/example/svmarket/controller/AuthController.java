package com.example.svmarket.controller;

import com.example.svmarket.dto.RegisterOtpRequest;
import com.example.svmarket.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.svmarket.dto.LoginRequest;
import com.example.svmarket.dto.LoginResponse;
import com.example.svmarket.service.AuthService;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }

    // Gửi OTP
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "OTP đã được gửi về email";
    }

    // Xác nhận OTP + tạo tài khoản
    @PostMapping("/register/verify")
    public String verifyOtp(@RequestBody RegisterOtpRequest request) {
        authService.verifyRegistrationOTP(request);
        return "Đăng ký thành công";
    }
}