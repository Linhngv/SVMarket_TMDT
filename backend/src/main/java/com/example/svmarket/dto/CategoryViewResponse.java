package com.example.svmarket.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryViewResponse {
    private String categoryName;
    private long normalViews;
    private long packageViews;
}
