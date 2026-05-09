package com.example.svmarket.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "message_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String oldContent;

    @Column(name = "edited_at")
    private LocalDateTime editedAt;
}