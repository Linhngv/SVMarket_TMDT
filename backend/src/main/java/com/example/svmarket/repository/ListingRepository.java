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

    List<Listing> findByStatus(ListingStatus status);

    /**
     * Tìm kiếm bài đăng theo trạng thái và từ khóa (title hoặc description chứa keyword, không phân biệt hoa thường)
     */
    List<Listing> findByStatusAndTitleContainingIgnoreCaseOrStatusAndDescriptionContainingIgnoreCase(
            ListingStatus status1, String keyword1, ListingStatus status2, String keyword2);
}
