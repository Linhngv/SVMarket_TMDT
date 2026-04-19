package com.example.svmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PackagePlanResponse {
    Integer id;
    String name;
    BigDecimal price;
    Integer postLimit;
    Integer pushLimit;
    Integer pushHours;
    Integer durationDays;
    Integer priorityLevel;
}
