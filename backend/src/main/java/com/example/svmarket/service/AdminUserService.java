package com.example.svmarket.service;

import com.example.svmarket.dto.UpdateUserAdminRequest;
import com.example.svmarket.dto.UserAdminResponse;
import com.example.svmarket.entity.Role;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserAdminResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public UserAdminResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return toDto(user);
    }

    public void updateUser(Integer id, UpdateUserAdminRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (request.getRole() != null) {
            user.setRole(Role.valueOf(request.getRole()));
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        userRepository.save(user);
    }

    private UserAdminResponse toDto(User user) {
        return UserAdminResponse.builder()
                .id(user.getId()).fullName(user.getFullName())
                .email(user.getEmail()).university(user.getUniversity())
                .avatar(user.getAvatar()).role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .postCount(user.getListings() != null ? user.getListings().size() : 0)
                .reportCount(0).build();
    }
}