package com.example.svmarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.svmarket.dto.*;
import com.example.svmarket.entity.*;
import com.example.svmarket.repository.*;

import java.nio.file.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // GET PROFILE
    public ProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Address address = user.getAddresses() != null
                ? user.getAddresses().stream().findFirst().orElse(null)
                : null;

        return new ProfileResponse(
                user.getFullName(),
                user.getAvatar(),
                user.getUniversity(),
                address != null ? address.getProvince() : "",
                address != null ? address.getAddressDetail() : "",
                user.getGender() != null ? user.getGender().name() : "OTHER");
    }

    // UPDATE PROFILE
    public void updateProfile(String email, UpdateProfileRequest req) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setFullName(req.getFullName());
        user.setUniversity(req.getUniversity());

        if (req.getGender() != null) {
            user.setGender(Gender.valueOf(req.getGender().toUpperCase()));
        }

        // ADDRESS HANDLING
        Address address = null;

        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            address = user.getAddresses().get(0);
        }

        if (address == null) {
            address = new Address();
            address.setUser(user);

            if (user.getAddresses() != null) {
                user.getAddresses().add(address);
            }
        }

        address.setProvince(req.getProvince());
        address.setAddressDetail(req.getAddressDetail());

        userRepository.save(user);
    }

    // UPLOAD AVATAR
    public String uploadAvatar(String email, MultipartFile file) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            if (file.isEmpty()) {
                throw new RuntimeException("File rỗng");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Chỉ được upload ảnh");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            String uploadDir = System.getProperty("user.dir") + "/uploads";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = "/uploads/" + fileName;
            user.setAvatar(avatarUrl);

            userRepository.save(user);

            return avatarUrl;

        } catch (Exception e) {
            throw new RuntimeException("Upload avatar thất bại");
        }
    }
}