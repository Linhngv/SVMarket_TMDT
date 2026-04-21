package com.example.svmarket.repository;

import com.example.svmarket.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findTopByOrderIdOrderByIdDesc(Integer orderId);
}
