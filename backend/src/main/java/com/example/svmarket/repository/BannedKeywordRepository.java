package com.example.svmarket.repository;

import com.example.svmarket.entity.BannedKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannedKeywordRepository extends JpaRepository<BannedKeyword, Integer> {

    // Tìm từ khóa cấm bằng keyword
    Optional<BannedKeyword> findByKeywordIgnoreCase(String keyword);

    // Kiểm tra xem keyword có tồn tại hay không
    boolean existsByKeywordIgnoreCase(String keyword);
}
