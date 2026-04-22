package com.example.svmarket.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.svmarket.entity.Listing;
import com.example.svmarket.entity.ListingStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<Listing, Integer> {
    List<Listing> findBySellerIdAndStatusNotOrderByCreatedAtDesc(Integer sellerId, ListingStatus status);

    List<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status);

    Optional<Listing> findByIdAndStatus(Integer id, ListingStatus status);

    Optional<Listing> findByIdAndSellerId(Integer id, Integer sellerId);

    @Query("SELECT COUNT(l) FROM Listing l " +
            "WHERE l.seller.id = :sellerId " +
            "AND l.status NOT IN :statuses")
    long countBySellerIdAndStatusNotIn(
            @Param("sellerId") Integer sellerId,
            @Param("statuses") List<ListingStatus> statuses
    );

    List<Listing> findByStatus(ListingStatus status);
}
