package com.example.svmarket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.ListingStatus;

public interface ListingRepository extends JpaRepository<Listing, Integer> {
    List<Listing> findBySellerIdAndStatusNotOrderByCreatedAtDesc(Integer sellerId, ListingStatus status);

    List<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status);

    Optional<Listing> findByIdAndStatus(Integer id, ListingStatus status);

    Optional<Listing> findByIdAndSellerId(Integer id, Integer sellerId);
}
