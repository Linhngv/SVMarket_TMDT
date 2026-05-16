package com.example.svmarket.repository;

import com.example.svmarket.entity.Payment;
import com.example.svmarket.entity.PaymentStatus;
import com.example.svmarket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);

    Optional<Payment> findTopByOrderIdOrderByIdDesc(Integer orderId);

    List<Payment> findByOrder_BuyerAndStatusOrderByIdDesc(User buyer, PaymentStatus status);
    // Thống kê số lượng giao dịch theo trạng thái sau một thời điểm  7 ngày, 30 ngày, 1 năm, ngày/tháng/năm cụ thể
    long countByCreatedAtAfter(LocalDateTime date);

    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS' AND p.createdAt > :date")
    Double sumTotalRevenueAfter(@Param("date") LocalDateTime date);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS' AND p.createdAt BETWEEN :startDate AND :endDate")
    Double sumTotalRevenueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p.status, COUNT(p.id) FROM Payment p WHERE p.createdAt > :date GROUP BY p.status")
    List<Object[]> countPaymentsByStatusAfter(@Param("date") LocalDateTime date);

    @Query("SELECT p.status, COUNT(p.id) FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate GROUP BY p.status")
    List<Object[]> countPaymentsByStatusBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}