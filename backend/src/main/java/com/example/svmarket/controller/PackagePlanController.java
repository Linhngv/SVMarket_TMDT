package com.example.svmarket.controller;

import com.example.svmarket.dto.PackagePlanResponse;
import com.example.svmarket.entity.PackagePlan;
import com.example.svmarket.service.PackagePlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;

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

    //tim kiem va loc goi tin
    @GetMapping("/admin/packages")
    public Page<PackagePlan> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer minPost,
            @RequestParam(required = false) Integer maxPost,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        if ("ALL".equalsIgnoreCase(status)) {
            status = null;
        }
        return packagePlanService.search(name, status, minPost, maxPost, page, size);
    }

    //them goi tin
    @PostMapping("/admin/packages")
    public PackagePlan create(@RequestBody PackagePlan p) {
        return packagePlanService.create(p);
    }

    //cap nhat goi tin
    @PutMapping("/admin/packages/{id}")
    public PackagePlan update(@PathVariable Integer id,
            @RequestBody PackagePlan p) {
        return packagePlanService.update(id, p);
    }

}
