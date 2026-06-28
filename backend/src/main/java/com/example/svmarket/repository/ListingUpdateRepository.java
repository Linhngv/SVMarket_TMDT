package com.example.svmarket.repository;

import com.example.svmarket.entity.ListingUpdate;
import com.example.svmarket.entity.ListingUpdateStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListingUpdateRepository extends JpaRepository<ListingUpdate, Integer> {
    Optional<ListingUpdate> findFirstByListingIdAndStatusOrderByCreatedAtDesc(Integer listingId, ListingUpdateStatus status);
}