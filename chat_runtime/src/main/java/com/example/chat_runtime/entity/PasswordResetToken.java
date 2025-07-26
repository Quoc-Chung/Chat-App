package com.example.chat_runtime.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;


  private String email;
  private String otp;
  private LocalDateTime expiry;
  private boolean verified = false;
  private int failedAttempts = 0;

  public boolean isExpired() {
    return LocalDateTime.now().isAfter(expiry);
  }

  public boolean isBlocked() {
    return failedAttempts >= 5;
  }
}
