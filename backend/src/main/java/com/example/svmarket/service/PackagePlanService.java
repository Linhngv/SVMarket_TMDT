package com.example.svmarket.service;

import com.example.svmarket.dto.PackagePlanResponse;
import com.example.svmarket.repository.PackagePlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.svmarket.entity.PackagePlan;
import com.example.svmarket.entity.PackageStatus;

import java.util.List;

@Service
public class PackagePlanService {
    @Autowired
    private PackagePlanRepository packagePlanRepository;

    // Lấy danh sách tất cả các gói hiện tại
    public List<PackagePlanResponse> getAllPlans() {
        return packagePlanRepository.findAll()
                .stream()
                .map(p -> new PackagePlanResponse(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getPostLimit(),
                        p.getPushLimit(),
                        p.getPushHours(),
                        p.getDurationDays(),
                        p.getPriorityLevel(),
                        p.getStatus() != null ? p.getStatus() : PackageStatus.ACTIVE
                ))
                .toList();
    }

    // them goi tin
    public PackagePlan create(PackagePlan p) {
        if (p.getStatus() == null) {
            p.setStatus(PackageStatus.ACTIVE);
        }
        if (p.getPostLimit() == null) p.setPostLimit(0);
        if (p.getPushLimit() == null) p.setPushLimit(0);
        if (p.getPushHours() == null) p.setPushHours(0);
        if (p.getPriorityLevel() == null) p.setPriorityLevel(1);
        if (p.getIsHighlight() == null) p.setIsHighlight(false);
        if (p.getIsFeatured() == null) p.setIsFeatured(false);
        
        return packagePlanRepository.save(p);
    }

    //cap nhat goi tin
    public PackagePlan update(Integer id, PackagePlan newData) {
        PackagePlan p = packagePlanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));

        p.setName(newData.getName());
        p.setPrice(newData.getPrice());
        p.setDurationDays(newData.getDurationDays());
        p.setStatus(newData.getStatus());
        
        // Cập nhật các trường mới thêm
        p.setPostLimit(newData.getPostLimit() != null ? newData.getPostLimit() : 0);
        p.setPushLimit(newData.getPushLimit() != null ? newData.getPushLimit() : 0);
        p.setPushHours(newData.getPushHours() != null ? newData.getPushHours() : 0);
        p.setPriorityLevel(newData.getPriorityLevel() != null ? newData.getPriorityLevel() : 1);
        p.setIsHighlight(newData.getIsHighlight() != null ? newData.getIsHighlight() : false);
        p.setIsFeatured(newData.getIsFeatured() != null ? newData.getIsFeatured() : false);

        return packagePlanRepository.save(p);
    }

    //tim kiem va loc goi tin
    public Page<PackagePlan> search(
        String name,
        String status,
        Integer minPost,
        Integer maxPost,
        int page,
        int size
) {
    Pageable pageable = PageRequest.of(page, size);
        
        PackageStatus packageStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                packageStatus = PackageStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) { }
        }

        return packagePlanRepository.search(name, packageStatus, minPost, maxPost, pageable);
}
}
