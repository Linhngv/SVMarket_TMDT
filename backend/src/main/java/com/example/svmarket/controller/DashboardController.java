package com.example.svmarket.controller;

import com.example.svmarket.dto.SellerDashboardResponse;
import com.example.svmarket.service.DashboardService;
import com.example.svmarket.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/seller/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private DashboardService dashboardService;

    private String extractEmail(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        return jwtUtil.extractEmail(bearerToken.replace("Bearer ", ""));
    }

    @GetMapping
    public ResponseEntity<SellerDashboardResponse> getSellerDashboard(
            @RequestHeader("Authorization") String token
    ) {

        String email = extractEmail(token);

        SellerDashboardResponse response =
                dashboardService.getSellerDashboard(email);

        return ResponseEntity.ok(response);
    }
}