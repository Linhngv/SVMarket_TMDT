package com.example.svmarket.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ListingSummaryResponse {
    private Integer id;
    private String title;
    private BigDecimal price;
    private String status;
    private String thumbnailUrl;
    private String sellerUniversity;
    private LocalDateTime createdAt;

    public ListingSummaryResponse() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getSellerUniversity() {
        return sellerUniversity;
    }

    public void setSellerUniversity(String sellerUniversity) {
        this.sellerUniversity = sellerUniversity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
