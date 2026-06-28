package com.example.svmarket.controller;

import com.example.svmarket.entity.BannedKeyword;
import com.example.svmarket.service.AdminBannedKeywordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/banned-keywords")
public class AdminBannedKeywordController {

    @Autowired
    private AdminBannedKeywordService adminBannedKeywordService;

    // DTO cho từ khóa cấm
    public static class BannedKeywordDTO {
        public Integer id;
        public String keyword;
        public String createdAt;

        public BannedKeywordDTO(BannedKeyword bannedKeyword) {
            this.id = bannedKeyword.getId();
            this.keyword = bannedKeyword.getKeyword();
            this.createdAt = bannedKeyword.getCreatedAt() != null ? bannedKeyword.getCreatedAt().toString() : "";
        }
    }

    // Lấy tất cả từ khóa cấm
    @GetMapping
    public ResponseEntity<List<BannedKeywordDTO>> getAllBannedKeywords() {
        List<BannedKeywordDTO> keywords = adminBannedKeywordService.getAllBannedKeywords()
                .stream()
                .map(BannedKeywordDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(keywords);
    }

    // Lấy từ khóa cấm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBannedKeywordById(@PathVariable Integer id) {
        try {
            BannedKeyword keyword = adminBannedKeywordService.getBannedKeywordById(id);
            return ResponseEntity.ok(new BannedKeywordDTO(keyword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Thêm từ khóa cấm mới
    @PostMapping
    public ResponseEntity<?> createBannedKeyword(@RequestParam("keyword") String keyword) {
        try {
            BannedKeyword newKeyword = adminBannedKeywordService.createBannedKeyword(keyword);
            return ResponseEntity.ok(new BannedKeywordDTO(newKeyword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật từ khóa cấm
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBannedKeyword(
            @PathVariable Integer id,
            @RequestParam("keyword") String keyword) {
        try {
            BannedKeyword updatedKeyword = adminBannedKeywordService.updateBannedKeyword(id, keyword);
            return ResponseEntity.ok(new BannedKeywordDTO(updatedKeyword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa từ khóa cấm theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBannedKeyword(@PathVariable Integer id) {
        try {
            adminBannedKeywordService.deleteBannedKeyword(id);
            return ResponseEntity.ok("Xóa từ khóa cấm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa nhiều từ khóa cấm
    @DeleteMapping
    public ResponseEntity<?> deleteBannedKeywords(@RequestBody List<Integer> ids) {
        try {
            adminBannedKeywordService.deleteBannedKeywordsByIds(ids);
            return ResponseEntity.ok("Xóa các từ khóa cấm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kiểm tra text có chứa từ khóa cấm không
    @PostMapping("/check")
    public ResponseEntity<?> checkBannedKeywords(@RequestParam("text") String text) {
        try {
            boolean hasBanned = adminBannedKeywordService.containsBannedKeyword(text);
            List<String> foundKeywords = adminBannedKeywordService.getBannedKeywordsInText(text);

            Map<String, Object> response = new HashMap<>();
            response.put("hasBannedKeyword", hasBanned);
            response.put("bannedKeywords", foundKeywords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
