package com.example.svmarket.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class ListingDetailResponse {
    private Integer id;
    private String title;
    private Integer categoryId;
    private String categoryName;
    private BigDecimal price;
    private String deliveryAddress;
    private String conditionLevel;
    private String description;
    private String status;
    private List<String> imageUrls;
}
