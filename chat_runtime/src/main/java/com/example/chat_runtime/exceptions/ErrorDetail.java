package com.example.chat_runtime.exceptions;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDetail {
  private String error;
  private String message; // <- chi tiết lỗi
  private LocalDateTime timestamp;
}
