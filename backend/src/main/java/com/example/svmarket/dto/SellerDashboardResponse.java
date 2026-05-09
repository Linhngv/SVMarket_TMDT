package com.example.svmarket.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerDashboardResponse {
    private long totalViews;
    private int activeListingCount;
    private int soldListingCount;
    private double averageRating;
    private int reviewCount;
    private long normalViews;
    private long packageViews;
    private List<TopListingResponse> topListings;
    private List<CategoryViewResponse> categoryViews;
}