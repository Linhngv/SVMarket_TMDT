package com.example.svmarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.svmarket.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}