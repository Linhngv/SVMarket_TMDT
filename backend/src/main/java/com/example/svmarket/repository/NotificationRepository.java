package com.example.svmarket.repository;

import java.util.List;

import com.example.svmarket.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.svmarket.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);

    List<Notification> findAllByUserIdAndTypeAndReferenceId(
            Integer userId, NotificationType type, Integer referenceId);

    List<Notification> findAllByUserIdAndTypeAndIsRead(
            Integer userId, NotificationType type, Boolean isRead);
}