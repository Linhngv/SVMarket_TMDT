package com.example.svmarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.svmarket.dto.ProfileResponse;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return new ProfileResponse(
                user.getFullName(),
                user.getAvatar(),
                user.getUniversity(),
                user.getAddress() != null ? user.getAddress().getProvince() : "",
                user.getAddress() != null ? user.getAddress().getAddressDetail() : "");
    }
}