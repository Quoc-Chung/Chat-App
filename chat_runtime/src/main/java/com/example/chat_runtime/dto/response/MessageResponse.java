package com.example.chat_runtime.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageResponse {
  private Integer id;
  private String content;
  private LocalDateTime timestamp;
  private Integer userId;
  private String userFullName;
}
