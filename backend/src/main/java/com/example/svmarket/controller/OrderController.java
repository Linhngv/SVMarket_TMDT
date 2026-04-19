package com.example.svmarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.svmarket.dto.OrderRequest;
import com.example.svmarket.service.OrderService;
import com.example.svmarket.util.JwtUtil;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/request")
    public String createOrder(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody OrderRequest request) {
        if (token == null || !token.startsWith("Bearer ") || token.equals("Bearer null")) {
            throw new RuntimeException("Vui lòng đăng nhập để thực hiện giao dịch");
        }

        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        orderService.createOrder(email, request);
        return "Đặt hàng thành công";
    }
}