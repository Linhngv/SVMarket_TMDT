package com.example.svmarket.controller;

import com.example.svmarket.dto.CategoryOptionResponse;
import com.example.svmarket.dto.ListingDetailResponse;
import com.example.svmarket.dto.ListingSummaryResponse;
import com.example.svmarket.dto.ListingUpsertRequest;
import com.example.svmarket.service.ListingService;
import com.example.svmarket.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "http://localhost:5173")
public class ListingController {

    @Autowired
    private ListingService listingService;

    @Autowired
    private JwtUtil jwtUtil;

    // Lay danh sach danh muc de frontend do vao dropdown.
    @GetMapping("/categories")
    public List<CategoryOptionResponse> getCategories() {
        return listingService.getCategories();
    }

    // Tao bai dang moi cua nguoi dang nhap.
    @PostMapping(value = "/my", consumes = { "multipart/form-data" })
    @ResponseStatus(HttpStatus.CREATED)
    public ListingDetailResponse createMyListing(@RequestHeader("Authorization") String token,
                                                 @Valid @ModelAttribute ListingUpsertRequest request,
                                                 @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        String email = extractEmail(token);
        return listingService.createMyListing(email, request, images);
    }

    // Lay danh sach bai dang cua nguoi dang nhap.
    @GetMapping("/my")
    public List<ListingSummaryResponse> getMyListings(@RequestHeader("Authorization") String token) {
        String email = extractEmail(token);
        return listingService.getMyListings(email);
    }

    // Lay chi tiet 1 bai dang de xem/sua.
    @GetMapping("/my/{id}")
    public ListingDetailResponse getMyListingById(@RequestHeader("Authorization") String token,
                                                   @PathVariable Integer id) {
        String email = extractEmail(token);
        return listingService.getMyListingById(email, id);
    }

    // Cap nhat bai dang cua nguoi dang nhap.
    @PutMapping(value = "/my/{id}", consumes = { "multipart/form-data" })
    public ListingDetailResponse updateMyListing(@RequestHeader("Authorization") String token,
                                                 @PathVariable Integer id,
                                                 @Valid @ModelAttribute ListingUpsertRequest request,
                                                 @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        String email = extractEmail(token);
        return listingService.updateMyListing(email, id, request, images);
    }

    // Xoa mem bai dang cua nguoi dang nhap.
    @DeleteMapping("/my/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyListing(@RequestHeader("Authorization") String token,
                                @PathVariable Integer id) {
        String email = extractEmail(token);
        listingService.deleteMyListing(email, id);
    }

    private String extractEmail(String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        return jwtUtil.extractEmail(token);
    }
}
