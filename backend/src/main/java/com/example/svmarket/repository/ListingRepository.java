package com.example.svmarket.repository;

import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ListingRepository extends JpaRepository<Listing, Integer> {
    List<Listing> findBySellerIdAndStatusNotOrderByCreatedAtDesc(Integer sellerId, ListingStatus status);

    Optional<Listing> findByIdAndSellerId(Integer id, Integer sellerId);
}
