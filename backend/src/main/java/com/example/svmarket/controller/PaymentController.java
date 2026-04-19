package com.example.svmarket.controller;

import com.example.svmarket.entity.SellerPackage;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.SellerPackageRepository;
import com.example.svmarket.service.PaymentService;
import com.example.svmarket.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Autowired
    private SellerPackageRepository sellerPackageRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/create")
    public String createPayment(@RequestParam Integer packageId,  @RequestParam String returnUrl) throws Exception {
        return paymentService.createPaymentUrl(packageId, returnUrl);
    }

    @GetMapping("/callback")
    public void callback(@RequestParam Map<String, String> params,
                         HttpServletResponse response) throws IOException {
        String orderInfo = params.get("vnp_OrderInfo");
        String responseCode = params.get("vnp_ResponseCode");
        String[] parts = orderInfo.split("-");

        String encodedReturnUrl = parts[5];
        String returnUrl = new String(Base64.getDecoder().decode(encodedReturnUrl));

        if ("00".equals(responseCode)) {
            paymentService.handlePaymentSuccess(params);
            response.sendRedirect(returnUrl + "/my-packages?status=success");
        } else {
            response.sendRedirect(returnUrl + "/my-packages?status=failed");
        }
    }

    // Lấy thông tin gói đã dăng ký của người dùng
    @GetMapping("/my-packages")
    public ResponseEntity<?> getMyPackages() {
        User currentUser = jwtUtil.getCurrentUser();
        List<SellerPackage> list = sellerPackageRepository.findBySellerId(currentUser.getId());
        return ResponseEntity.ok(list);
    }
}
