package com.example.chat_runtime.service.impl;

import com.example.chat_runtime.config.TokenProvider;
import com.example.chat_runtime.dto.request.ResetPasswordRequest;
import com.example.chat_runtime.dto.request.SendOtpRequest;
import com.example.chat_runtime.dto.request.VerifyOtpRequest;
import com.example.chat_runtime.dto.response.OtpResponse;
import com.example.chat_runtime.entity.PasswordResetToken;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.repository.PasswordResetTokenRepository;
import com.example.chat_runtime.repository.UserRepository;
import com.example.chat_runtime.service.AuthService;
import com.example.chat_runtime.service.CustomUserService;
import com.example.chat_runtime.service.AsyncEmailService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final TokenProvider tokenProvider;
  private final CustomUserService customUserService;
  private final PasswordResetTokenRepository tokenRepo;
  private final AsyncEmailService emailService;

  private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d[^\\s]]{8,}$";

  private boolean isValidEmail(String email) {
    return email != null && email.matches(EMAIL_REGEX);
  }

  private boolean isValidPassword(String password) {
    return password != null && password.matches(PASSWORD_REGEX);
  }

  @Override
  public ResponseEntity<OtpResponse> sendOtp(SendOtpRequest request) {
    String email = request.getEmail();

    if (!isValidEmail(email)) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Email không hợp lệ"));
    }

    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Email không tồn tại"));
    }

    long recentTokens = tokenRepo.countByEmailAndExpiryAfter(email, LocalDateTime.now().minusHours(1));
    if (recentTokens >= 3) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Vui lòng chờ 1 giờ trước khi gửi OTP mới"));
    }

    String otp = String.format("%06d", new Random().nextInt(999999));
    LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

    tokenRepo.deleteByEmail(email);
    tokenRepo.save(new PasswordResetToken(null, email, otp, expiry, false, 0));
    emailService.sendAsync(email, otp);
    return ResponseEntity.ok(new OtpResponse(email, expiry, "OTP đã được gửi"));
  }

  @Override
  public ResponseEntity<OtpResponse> verifyOtp(VerifyOtpRequest request) {
    String email = request.getEmail();
    String otp = request.getOtp();

    Optional<PasswordResetToken> tokenOpt = tokenRepo.findByEmail(email);
    if (tokenOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Không tìm thấy OTP cho email này"));
    }

    PasswordResetToken token = tokenOpt.get();

    if (token.isExpired()) {
      tokenRepo.delete(token);
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "OTP đã hết hạn. Vui lòng yêu cầu OTP mới"));
    }

    if (token.isBlocked()) {
      tokenRepo.delete(token);
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "OTP đã bị khoá do nhập sai quá nhiều lần. Vui lòng yêu cầu OTP mới"));
    }

    if (!token.getOtp().equals(otp)) {
      token.setFailedAttempts(token.getFailedAttempts() + 1);
      tokenRepo.save(token);

      if (token.getFailedAttempts() >= 5) {
        tokenRepo.delete(token);
        return ResponseEntity.badRequest().body(new OtpResponse(email, null, "OTP đã bị khoá do nhập sai quá nhiều lần. Vui lòng yêu cầu OTP mới"));
      }

      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "OTP không chính xác. Còn " + (5 - token.getFailedAttempts()) + " lần thử"));
    }

    token.setVerified(true);
    tokenRepo.save(token);

    return ResponseEntity.ok(new OtpResponse(email, token.getExpiry(), "Xác thực OTP thành công"));
  }

  @Override
  public ResponseEntity<OtpResponse> resetPassword(ResetPasswordRequest request) {
    String email = request.getEmail();
    String newPassword = request.getNewPassword();
    String confirmPassword = request.getConfirmPassword();

    if (newPassword == null || confirmPassword == null || !newPassword.equals(confirmPassword)) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Mật khẩu xác nhận không khớp"));
    }

    if (!isValidPassword(newPassword)) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Mật khẩu mới không hợp lệ"));
    }

    Optional<PasswordResetToken> tokenOpt = tokenRepo.findByEmail(email);
    if (tokenOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Không tìm thấy OTP cho email này"));
    }

    PasswordResetToken token = tokenOpt.get();

    if (!token.isVerified()) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Bạn chưa xác thực OTP"));
    }

    if (token.isExpired()) {
      tokenRepo.delete(token);
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "OTP đã hết hạn. Vui lòng yêu cầu OTP mới"));
    }

    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(new OtpResponse(email, null, "Email không tồn tại"));
    }

    User user = userOpt.get();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);
    tokenRepo.delete(token);

    return ResponseEntity.ok(new OtpResponse(email, null, "Đổi mật khẩu thành công"));
  }
}