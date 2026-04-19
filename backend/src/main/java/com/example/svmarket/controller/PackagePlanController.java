package com.example.svmarket.controller;

import com.example.svmarket.dto.PackagePlanResponse;
import com.example.svmarket.service.PackagePlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/package-plans")
@RequiredArgsConstructor
public class PackagePlanController {
    @Autowired
    private PackagePlanService packagePlanService;

    @GetMapping
    public List<PackagePlanResponse> getAllPlans() {
        return packagePlanService.getAllPlans();
    }
}
