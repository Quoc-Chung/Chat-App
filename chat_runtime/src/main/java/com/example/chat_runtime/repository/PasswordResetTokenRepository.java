package com.example.chat_runtime.repository;

import com.example.chat_runtime.entity.PasswordResetToken;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

  // Tìm OTP theo email
  Optional<PasswordResetToken> findByEmail(String email);

  // Xóa OTP theo email (mỗi email chỉ lưu 1 OTP gần nhất)
  void deleteByEmail(String email);

  // Đếm số OTP đã tạo trong 1 giờ qua (giới hạn gửi OTP)
  long countByEmailAndExpiryAfter(String email, LocalDateTime time);
}