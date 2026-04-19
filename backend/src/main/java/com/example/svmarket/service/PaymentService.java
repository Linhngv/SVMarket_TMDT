package com.example.svmarket.service;

import com.example.svmarket.config.VnpayConfig;
import com.example.svmarket.entity.PackagePlan;
import com.example.svmarket.entity.SellerPackage;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.PackagePlanRepository;
import com.example.svmarket.repository.SellerPackageRepository;
import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Autowired
    private PackagePlanRepository packagePlanRepository;

    @Autowired
    private VnpayConfig config;

    @Autowired
    private SellerPackageRepository sellerPackageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String createPaymentUrl(Integer packageId, String returnUrl) throws Exception {
        User currentUser = jwtUtil.getCurrentUser();

        PackagePlan plan = packagePlanRepository.findById(packageId)
                .orElseThrow();

        String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
        String amount = String.valueOf(plan.getPrice().intValue() * 100);

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", config.vnp_TmnCode);
        params.put("vnp_Amount", amount);
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", vnp_TxnRef);
        String encodedReturnUrl = Base64.getEncoder().encodeToString(returnUrl.getBytes());

        params.put("vnp_OrderInfo",
                "packageId-" + packageId +
                        "-userId-" + currentUser.getId() +
                        "-returnUrl-" + encodedReturnUrl);
        params.put("vnp_OrderType", "other");

        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", config.vnp_ReturnUrl);
        params.put("vnp_IpAddr", "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        params.put("vnp_CreateDate", formatter.format(cld.getTime()));

        Map<String, String> build = buildQueryAndHash(params);

        String hash = hmacSHA512(config.vnp_HashSecret, build.get("hashData"));

        return config.vnp_PayUrl + "?" + build.get("query") + "&vnp_SecureHash=" + hash;
    }

    public void handlePaymentSuccess(Map<String, String> params) {

        String orderInfo = params.get("vnp_OrderInfo");
        String[] parts = orderInfo.split("-");
        Integer packageId = Integer.parseInt(parts[1]);
        Integer userId = Integer.parseInt(parts[3]);

        PackagePlan plan = packagePlanRepository.findById(packageId)
                .orElseThrow();

        User user = userRepository.findById(userId).orElseThrow();

        SellerPackage sp = SellerPackage.builder()
                .seller(user)
                .packagePlan(plan)
                .remainingPosts(plan.getPostLimit())
                .remainingPushes(plan.getPushLimit())
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(plan.getDurationDays()))
                .build();

        sellerPackageRepository.save(sp);
    }


    public static Map<String, String> buildQueryAndHash(Map<String, String> params) throws Exception {

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8);

                hashData.append(fieldName).append("=").append(encodedValue).append("&");

                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                query.append("=");
                query.append(encodedValue);
                query.append("&");
            }
        }

        hashData.deleteCharAt(hashData.length() - 1);
        query.deleteCharAt(query.length() - 1);

        Map<String, String> result = new HashMap<>();
        result.put("hashData", hashData.toString());
        result.put("query", query.toString());

        return result;
    }

    public static String hmacSHA512(final String key, final String data) {
        try {
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            final SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            hmac512.init(secretKey);

            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

}
