package com.example.svmarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.repository.ListingRepository;
import com.example.svmarket.repository.PaymentRepository;
import com.example.svmarket.repository.SellerPackageRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminDashboardController {

    @Autowired private UserRepository userRepository;
    @Autowired private ListingRepository listingRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private SellerPackageRepository sellerPackageRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "30 ngày") String period) {
        
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();
        
        if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            start = java.time.LocalDate.parse(startDate).atStartOfDay();
            end = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
        } else {
            // 1. Phân loại theo khoảng thời gian được chọn
            if ("7 ngày".equals(period) || "7 ngày qua".equals(period)) {
                start = LocalDateTime.now().minusDays(7);
            } else if ("1 năm".equals(period) || "Năm nay".equals(period)) {
                start = LocalDateTime.now().minusDays(365);
            } else {
                // Mặc định là "30 ngày"
                start = LocalDateTime.now().minusDays(30);
            }
        }

        Map<String, Object> response = new HashMap<>();

        // 2. Lấy 4 Tổng số từ CSDL
        long totalUsers = userRepository.countByCreatedAtBetween(start, end);
        long totalPosts = listingRepository.countByCreatedAtBetween(start, end);
        long totalTransactions = paymentRepository.countByCreatedAtBetween(start, end);
        Double revenue = sellerPackageRepository.sumPackageRevenueBetween(start, end);
        double totalRevenue = (revenue != null) ? revenue : 0.0;

        response.put("totalUsers", totalUsers);
        response.put("totalPosts", totalPosts);
        response.put("totalTransactions", totalTransactions);
        response.put("totalRevenue", totalRevenue);

        // 3. Tính toán tỷ lệ giao dịch (Thành công / Hoàn tiền / Thất bại)
        List<Object[]> statusCounts = paymentRepository.countPaymentsByStatusBetween(start, end);
        long successCount = 0, failedCount = 0, total = 0;
        for (Object[] row : statusCounts) {
            String status = row[0].toString();
            long count = (long) row[1];
            if ("SUCCESS".equalsIgnoreCase(status)) successCount += count;
            else if ("FAILED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status)) failedCount += count;
            total += count;
        }
        long pendingCount = total - successCount - failedCount;

        response.put("transactionRate", Map.of(
            "success", total > 0 ? (successCount * 100 / total) : 0,
            "refund", total > 0 ? (pendingCount * 100 / total) : 0, 
            "failed", total > 0 ? (failedCount * 100 / total) : 0
        ));
        
        response.put("userGrowth", calculateUserGrowth(start, end));
        
        List<Map<String, Object>> categoryStats = listingRepository.countPostsByCategoryBetween(start, end);
        List<Map<String, Object>> formattedCategoryStats = new ArrayList<>();
        for (Map<String, Object> stat : categoryStats) {
            formattedCategoryStats.add(Map.of("label", stat.get("categoryName"), "val", stat.get("postCount")));
        }
        response.put("postsByCategory", formattedCategoryStats);

        List<Object[]> packageCounts = sellerPackageRepository.countPackagesByPlanBetween(start, end);
        List<Map<String, Object>> packageStats = new ArrayList<>();
        for (Object[] row : packageCounts) {
            packageStats.add(Map.of("name", row[0].toString(), "count", (long) row[1]));
        }
        response.put("packageStats", packageStats);

        response.put("recentActivities", Arrays.asList(
            Map.of("text", totalUsers + " người dùng mới đăng ký", "type", "user"), 
            Map.of("text", totalPosts + " bài đăng được duyệt", "type", "post"),
            Map.of("text", successCount + " giao dịch thành công", "type", "transaction")
        ));

        return ResponseEntity.ok(response);
    }

    private List<Long> calculateUserGrowth(LocalDateTime startDate, LocalDateTime endDate) {
        // Khởi tạo mảng 7 phần tử đại diện cho T2, T3, T4, T5, T6, T7, CN
        List<Long> growth = Arrays.asList(0L, 0L, 0L, 0L, 0L, 0L, 0L);
        List<LocalDateTime> dates = userRepository.findCreatedAtBetween(startDate, endDate);
        for (LocalDateTime date : dates) {
            int index = date.getDayOfWeek().getValue() - 1; // getDayOfWeek().getValue() trả về 1(T2) -> 7(CN)
            growth.set(index, growth.get(index) + 1); // Tăng biến đếm của Thứ đó lên 1
        }
        return growth;
    }
}