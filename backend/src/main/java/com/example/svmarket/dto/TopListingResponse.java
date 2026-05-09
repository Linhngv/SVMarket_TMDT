package com.example.svmarket.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopListingResponse {
    private Integer id;
    private String title;
    private Integer viewCount;
    private String type;
}