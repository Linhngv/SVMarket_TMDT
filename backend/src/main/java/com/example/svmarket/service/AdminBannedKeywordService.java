package com.example.svmarket.service;

import com.example.svmarket.entity.BannedKeyword;
import com.example.svmarket.repository.BannedKeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminBannedKeywordService {

    @Autowired
    private BannedKeywordRepository bannedKeywordRepository;

    // Lấy tất cả từ khóa cấm
    public List<BannedKeyword> getAllBannedKeywords() {
        return bannedKeywordRepository.findAll();
    }

    // Lấy từ khóa cấm theo ID
    public BannedKeyword getBannedKeywordById(Integer id) {
        return bannedKeywordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy từ khóa cấm có ID: " + id));
    }

    // Thêm từ khóa cấm mới
    public BannedKeyword createBannedKeyword(String keyword) {
        // Kiểm tra keyword không được rỗng
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new RuntimeException("Từ khóa không được để trống");
        }

        String trimmedKeyword = keyword.trim();

        // Kiểm tra keyword đã tồn tại chưa (không phân biệt hoa/thường)
        if (bannedKeywordRepository.existsByKeywordIgnoreCase(trimmedKeyword)) {
            throw new RuntimeException("Từ khóa '" + trimmedKeyword + "' đã tồn tại");
        }

        // Tạo từ khóa cấm mới
        BannedKeyword bannedKeyword = BannedKeyword.builder()
                .keyword(trimmedKeyword)
                .createdAt(LocalDateTime.now())
                .build();

        return bannedKeywordRepository.save(bannedKeyword);
    }

    // Cập nhật từ khóa cấm
    public BannedKeyword updateBannedKeyword(Integer id, String keyword) {
        // Kiểm tra từ khóa tồn tại không
        BannedKeyword bannedKeyword = getBannedKeywordById(id);

        // Kiểm tra keyword không được rỗng
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new RuntimeException("Từ khóa không được để trống");
        }

        String trimmedKeyword = keyword.trim();

        // Kiểm tra keyword mới đã tồn tại chưa (ngoại trừ keyword hiện tại)
        if (!bannedKeyword.getKeyword().equalsIgnoreCase(trimmedKeyword)) {
            if (bannedKeywordRepository.existsByKeywordIgnoreCase(trimmedKeyword)) {
                throw new RuntimeException("Từ khóa '" + trimmedKeyword + "' đã tồn tại");
            }
        }

        // Cập nhật keyword
        bannedKeyword.setKeyword(trimmedKeyword);
        return bannedKeywordRepository.save(bannedKeyword);
    }

    // Xóa từ khóa cấm
    public void deleteBannedKeyword(Integer id) {
        BannedKeyword bannedKeyword = getBannedKeywordById(id);
        bannedKeywordRepository.deleteById(id);
    }

    // Xóa nhiều từ khóa cấm theo danh sách ID
    public void deleteBannedKeywordsByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new RuntimeException("Danh sách ID không được rỗng");
        }
        bannedKeywordRepository.deleteAllById(ids);
    }

    // Kiểm tra text có chứa từ khóa cấm không
    public boolean containsBannedKeyword(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }

        List<BannedKeyword> bannedKeywords = bannedKeywordRepository.findAll();

        for (BannedKeyword bk : bannedKeywords) {
            if (text.toLowerCase().contains(bk.getKeyword().toLowerCase())) {
                return true;
            }
        }

        return false;
    }

    // Lấy danh sách từ khóa cấm được tìm thấy trong text
    public List<String> getBannedKeywordsInText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return List.of();
        }

        List<BannedKeyword> bannedKeywords = bannedKeywordRepository.findAll();
        String lowerText = text.toLowerCase();

        return bannedKeywords.stream()
                .filter(bk -> lowerText.contains(bk.getKeyword().toLowerCase()))
                .map(BannedKeyword::getKeyword)
                .toList();
    }
}
