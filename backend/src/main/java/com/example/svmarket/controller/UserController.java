// package com.example.svmarket.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import com.example.svmarket.dto.ProfileResponse;
// import com.example.svmarket.dto.UpdateProfileRequest;
// import com.example.svmarket.service.UserService;
// import com.example.svmarket.util.JwtUtil;

// @RestController
// @RequestMapping("/api/user")
// @CrossOrigin(origins = "http://localhost:5173")
// public class UserController {

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @GetMapping("/profile")
//     public ProfileResponse getProfile(@RequestHeader("Authorization") String token) {
//         token = token.replace("Bearer ", "");
//         String email = jwtUtil.extractEmail(token);
//         return userService.getProfile(email);
//     }

//     // UPDATE PROFILE
//     @PutMapping("/profile")
//     public String updateProfile(
//             @RequestHeader("Authorization") String token,
//             @RequestBody UpdateProfileRequest request) {
//         token = token.replace("Bearer ", "");
//         String email = jwtUtil.extractEmail(token);

//         userService.updateProfile(email, request);

//         return "Cập nhật thành công";
//     }
// }

package com.example.svmarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.svmarket.dto.ProfileResponse;
import com.example.svmarket.dto.UpdateProfileRequest;
import com.example.svmarket.service.UserService;
import com.example.svmarket.util.JwtUtil;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ProfileResponse getProfile(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return userService.getProfile(email);
    }

    // UPDATE PROFILE
    @PutMapping("/profile")
    public String updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UpdateProfileRequest request) {
        token = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        userService.updateProfile(email, request);

        return "Cập nhật thành công";
    }

    @PostMapping("/avatar")
    public String uploadAvatar(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        token = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        return userService.uploadAvatar(email, file);
    }
}