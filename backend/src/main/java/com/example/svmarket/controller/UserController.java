package com.example.svmarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.svmarket.dto.ProfileResponse;
import com.example.svmarket.service.UserService;
import com.example.svmarket.util.JwtUtil;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ProfileResponse getProfile(@RequestHeader("Authorization") String token) {

        // token dạng: Bearer xxx
        token = token.replace("Bearer ", "");

        String email = jwtUtil.extractEmail(token);

        return userService.getProfile(email);
    }
}