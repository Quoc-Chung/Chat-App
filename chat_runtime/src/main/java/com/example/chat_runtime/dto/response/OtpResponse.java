package com.example.chat_runtime.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpResponse {
  private String email;
  private LocalDateTime expiryTime;
  private String message;
}
