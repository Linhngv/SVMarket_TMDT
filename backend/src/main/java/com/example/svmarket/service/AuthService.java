package com.example.svmarket.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.svmarket.dto.LoginRequest;
import com.example.svmarket.dto.LoginResponse;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.util.JwtUtil;


@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest req) {
        System.out.println("INPUT: " + req.getEmailOrPhone());
        System.out.println("PASS: " + req.getPassword());



        // 1. Lấy thông tin user dưới database lên
        User user = userRepository.findByEmailOrPhone(req.getEmailOrPhone());
        System.out.println("USER = " + user);

        if (user == null) {
            return new LoginResponse(null, "Tài khoản không tồn tại");
        }

        // 2. So sánh mật khẩu
        if (!user.getPassword().equals(req.getPassword())) {
            return new LoginResponse(null, "Sai mật khẩu");
        }
        System.out.println("DB PASS = " + user.getPassword());
        String token = jwtUtil.generateToken(user.getEmail());
        System.out.println("REQ PASS=[" + req.getPassword() + "]");
        System.out.println("LENGTH=" + req.getPassword().length());
        return new LoginResponse(token, "Login success");
    }
}