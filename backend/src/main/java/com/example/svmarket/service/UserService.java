// package com.example.svmarket.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.example.svmarket.dto.ProfileResponse;
// import com.example.svmarket.dto.UpdateProfileRequest;
// import com.example.svmarket.entity.Address;
// import com.example.svmarket.entity.User;
// import com.example.svmarket.repository.UserRepository;
// import org.springframework.web.multipart.MultipartFile;

// @Service
// public class UserService {

//     @Autowired
//     private UserRepository userRepository;

//     // GET PROFILE
//     public ProfileResponse getProfile(String email) {
//         User user = userRepository.findByEmail(email)
//                 .orElseThrow(() -> new RuntimeException("User không tồn tại"));

//         return new ProfileResponse(
//                 user.getFullName(),
//                 user.getAvatar(),
//                 user.getUniversity(),
//                 user.getAddress() != null ? user.getAddress().getProvince() : "",
//                 user.getAddress() != null ? user.getAddress().getAddressDetail() : "");
//     }

//     // UPDATE PROFILE
//     public void updateProfile(String email, UpdateProfileRequest req) {

//         User user = userRepository.findByEmail(email)
//                 .orElseThrow(() -> new RuntimeException("User không tồn tại"));

//         // update bảng users
//         user.setFullName(req.getFullName());
//         user.setUniversity(req.getUniversity());

//         // update bảng address
//         Address address = user.getAddress();

//         if (address == null) {
//             address = new Address();
//         }

//         address.setProvince(req.getProvince());
//         address.setAddressDetail(req.getAddressDetail());

//         user.setAddress(address);

//         userRepository.save(user);
//     }
// }


package com.example.svmarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.svmarket.dto.ProfileResponse;
import com.example.svmarket.dto.UpdateProfileRequest;
import com.example.svmarket.entity.Address;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // GET PROFILE
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

    // UPDATE PROFILE
    public void updateProfile(String email, UpdateProfileRequest req) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // update bảng users
        user.setFullName(req.getFullName());
        user.setUniversity(req.getUniversity());

        // update bảng address
        Address address = user.getAddress();

        if (address == null) {
            address = new Address();
        }

        address.setProvince(req.getProvince());
        address.setAddressDetail(req.getAddressDetail());

        user.setAddress(address);

        userRepository.save(user);
    }

    public String uploadAvatar(String email, MultipartFile file) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            // validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File rỗng");
            }

            // chỉ cho phép ảnh
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Chỉ được upload ảnh");
            }

            // tạo tên file
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // thư mục upload
            String uploadDir = System.getProperty("user.dir") + "/uploads";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);

            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            // lưu file
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(
                    file.getInputStream(),
                    filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // lưu DB
            String avatarUrl = "/uploads/" + fileName;
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            return avatarUrl;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload avatar thất bại");
        }
    }
}