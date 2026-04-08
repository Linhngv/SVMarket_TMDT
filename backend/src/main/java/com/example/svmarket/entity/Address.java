package com.example.svmarket.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "address")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String province;
    private String district;

    private String ward;

    @Column(name = "address_detail")
    private String addressDetail; // Địa chỉ chi tiết
}
