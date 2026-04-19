package com.example.svmarket.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "package_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackagePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    // Số bài đăng
    @Column(name = "post_limit", nullable = false)
    private Integer postLimit;

    // Số lượt đẩy tin
    @Column(name = "push_limit", nullable = false)
    private Integer pushLimit;

    // Hiệu lực mỗi lần đẩy
    @Column(name = "push_hours", nullable = false)
    private Integer pushHours;

    // Thời hạn gói
    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    // Mức độ ưu tiên sort (1 = thấp, 2 = trung, 3 = cao nhất)
    @Column(name = "priority_level", nullable = false)
    private Integer priorityLevel;

    // Có nổi bật không
    @Column(name = "is_highlight")
    private Boolean isHighlight;

    //Có vào mục đề xuất không
    @Column(name = "is_featured")
    private Boolean isFeatured;
}