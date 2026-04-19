package com.example.svmarket.repository;

import com.example.svmarket.entity.SellerPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerPackageRepository extends JpaRepository<SellerPackage, Integer> {
    List<SellerPackage> findBySellerId(Integer sellerId);
}
