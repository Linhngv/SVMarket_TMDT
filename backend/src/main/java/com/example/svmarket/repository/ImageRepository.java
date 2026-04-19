package com.example.svmarket.repository;

import com.example.svmarket.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    void deleteByListingId(Integer listingId);
}
