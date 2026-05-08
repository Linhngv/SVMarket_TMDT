package com.example.svmarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.repository.ListingRepository;
import com.example.svmarket.repository.PaymentRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminDashboardController {

    @Autowired private UserRepository userRepository;
    @Autowired private ListingRepository listingRepository;
    @Autowired private PaymentRepository paymentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam(defaultValue = "30 ngày qua") String period) {
        LocalDateTime startDate;
        
        // 1. Phân loại theo khoảng thời gian được chọn
        if ("7 ngày qua".equals(period)) {
            startDate = LocalDateTime.now().minusDays(7);
        } else if ("Năm nay".equals(period)) {
            startDate = LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        } else {
            // Mặc định là "30 ngày qua"
            startDate = LocalDateTime.now().minusDays(30);
        }

        Map<String, Object> response = new HashMap<>();

        // 2. Lấy 4 Tổng số từ CSDL
        long totalUsers = userRepository.countByCreatedAtAfter(startDate);
        long totalPosts = listingRepository.countByCreatedAtAfter(startDate);
        long totalTransactions = paymentRepository.countByCreatedAtAfter(startDate);
        Double revenue = paymentRepository.sumTotalRevenueAfter(startDate);
        double totalRevenue = (revenue != null) ? revenue : 0.0;

        response.put("totalUsers", totalUsers);
        response.put("totalPosts", totalPosts);
        response.put("totalTransactions", totalTransactions);
        response.put("totalRevenue", totalRevenue);

        // 3. Tính toán tỷ lệ giao dịch (Thành công / Hoàn tiền / Thất bại)
        List<Object[]> statusCounts = paymentRepository.countPaymentsByStatusAfter(startDate);
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
        
        response.put("userGrowth", calculateUserGrowth(startDate, LocalDateTime.now()));
        
        List<Map<String, Object>> categoryStats = listingRepository.countPostsByCategoryAfter(startDate);
        List<Map<String, Object>> formattedCategoryStats = new ArrayList<>();
        for (Map<String, Object> stat : categoryStats) {
            formattedCategoryStats.add(Map.of("label", stat.get("categoryName"), "val", stat.get("postCount")));
        }
        response.put("postsByCategory", formattedCategoryStats);

        response.put("recentActivities", Arrays.asList(
            Map.of("text", totalUsers + " người dùng mới đăng ký", "type", "user"), 
            Map.of("text", totalPosts + " bài đăng được duyệt", "type", "post"),
            Map.of("text", "2 khiếu nại mới", "type", "report"), 
            Map.of("text", successCount + " giao dịch thành công", "type", "transaction")
        ));

        return ResponseEntity.ok(response);
    }

    private List<Long> calculateUserGrowth(LocalDateTime startDate, LocalDateTime endDate) {
        // Khởi tạo mảng 7 phần tử đại diện cho T2, T3, T4, T5, T6, T7, CN
        List<Long> growth = Arrays.asList(0L, 0L, 0L, 0L, 0L, 0L, 0L);
        List<LocalDateTime> dates = userRepository.findCreatedAtAfter(startDate);
        for (LocalDateTime date : dates) {
            if (!date.isAfter(endDate)) {
                int index = date.getDayOfWeek().getValue() - 1; // getDayOfWeek().getValue() trả về 1(T2) -> 7(CN)
                growth.set(index, growth.get(index) + 1); // Tăng biến đếm của Thứ đó lên 1
            }
        }
        return growth;
    }
}