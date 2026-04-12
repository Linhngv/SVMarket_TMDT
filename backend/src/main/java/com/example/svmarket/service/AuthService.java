package com.example.svmarket.service;
import com.example.svmarket.dto.RegisterOtpRequest;
import com.example.svmarket.dto.RegisterRequest;
import com.example.svmarket.entity.PasswordResetOTP;
import com.example.svmarket.entity.Role;
import com.example.svmarket.exception.BadRequestException;
import com.example.svmarket.repository.PasswordResetOTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.svmarket.dto.LoginRequest;
import com.example.svmarket.dto.LoginResponse;
import com.example.svmarket.entity.User;
import com.example.svmarket.repository.UserRepository;
import com.example.svmarket.util.JwtUtil;

import java.time.LocalDateTime;


@Service
public class AuthService {
    private static final String PASSWORD_POLICY_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordResetOTPRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public LoginResponse login(LoginRequest req) {
        System.out.println("INPUT: " + req.getEmailOrPhone());
        System.out.println("PASS: " + req.getPassword());



        // 1. Lấy thông tin user dưới database lên
        User user = userRepository.findByEmailOrPhone(req.getEmailOrPhone());
        System.out.println("USER = " + user);

        if (user == null) {
            return new LoginResponse(null, "Tài khoản không tồn tại");
        }

        // 2. So sánh mật khẩu
        if (!user.getPassword().equals(req.getPassword())) {
            return new LoginResponse(null, "Sai mật khẩu");
        }
        System.out.println("DB PASS = " + user.getPassword());
        String token = jwtUtil.generateToken(user.getEmail());
        System.out.println("REQ PASS=[" + req.getPassword() + "]");
        System.out.println("LENGTH=" + req.getPassword().length());
        return new LoginResponse(token, "Login success");
    }

    public void register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email đã được đăng ký!");
        }

        if (!registerRequest.getPassword().matches(PASSWORD_POLICY_REGEX)) {
            throw new BadRequestException("Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 6 ký tự");
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        otpRepository.deleteByEmail(registerRequest.getEmail());

        PasswordResetOTP otpEntity = new PasswordResetOTP();
        otpEntity.setEmail(registerRequest.getEmail());
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpEntity);
        emailService.sendOTP(registerRequest.getEmail(), otp, "dang ky tai khoan");
    }


    public void verifyRegistrationOTP(RegisterOtpRequest request) {
        PasswordResetOTP otpEntity = otpRepository.findByEmailAndOtp(request.getEmail(), request.getOtp())
                .orElseThrow(() -> new BadRequestException("OTP không hợp lệ"));

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP đã hết hạn");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được đăng ký!");
        }

        if (!request.getPassword().matches(PASSWORD_POLICY_REGEX)) {
            throw new BadRequestException("Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 6 ký tự");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus("Đang hoạt động");
        user.setRole(Role.USER);

        userRepository.save(user);
        otpRepository.delete(otpEntity);
    }
}