package com.example.svmarket.service;

import com.example.svmarket.dto.PackagePlanResponse;
import com.example.svmarket.repository.PackagePlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                        p.getPriorityLevel()
                ))
                .toList();
    }
}
