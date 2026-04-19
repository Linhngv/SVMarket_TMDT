package com.example.svmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ListingSummaryResponse {
    private Integer id;
    private String title;
    private BigDecimal price;
    private String status;
    private String thumbnailUrl;
}
