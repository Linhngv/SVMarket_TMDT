package com.example.svmarket.repository;

import com.example.svmarket.entity.MessageHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageHistoryRepository extends JpaRepository<MessageHistory, Long> {
    List<MessageHistory> findByMessageIdOrderByEditedAtDesc(Integer messageId);
}