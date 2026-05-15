package com.example.svmarket.controller;

import com.example.svmarket.dto.SellerDashboardResponse;
import com.example.svmarket.service.DashboardService;
import com.example.svmarket.service.AdminBannedKeywordService;
import com.example.svmarket.entity.BannedKeyword;
import com.example.svmarket.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private AdminBannedKeywordService adminBannedKeywordService;

    private String extractEmail(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        return jwtUtil.extractEmail(bearerToken.replace("Bearer ", ""));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSellerDashboard(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {

        String email = extractEmail(token);

        SellerDashboardResponse dashboardData =
                dashboardService.getSellerDashboard(email, startDate, endDate);

        long totalSpent = dashboardService.calculateTotalSpentOnPackages(email, startDate, endDate);

        // Tạo Map thủ công để tránh lỗi missing package của Jackson
        Map<String, Object> response = new HashMap<>();
        response.put("totalViews", dashboardData.getTotalViews());
        response.put("activeListingCount", dashboardData.getActiveListingCount());
        response.put("soldListingCount", dashboardData.getSoldListingCount());
        response.put("averageRating", dashboardData.getAverageRating());
        response.put("reviewCount", dashboardData.getReviewCount());
        response.put("normalViews", dashboardData.getNormalViews());
        response.put("packageViews", dashboardData.getPackageViews());
        response.put("topListings", dashboardData.getTopListings());
        response.put("categoryViews", dashboardData.getCategoryViews());
        response.put("totalSpentOnPackages", totalSpent);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/banned-keywords")
    public ResponseEntity<List<String>> getBannedKeywords() {
        List<String> keywords = adminBannedKeywordService.getAllBannedKeywords()
                .stream()
                .map(BannedKeyword::getKeyword)
                .toList();
        return ResponseEntity.ok(keywords);
    }
}