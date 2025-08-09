package com.example.chat_runtime.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ChatAiResponse {
  private String response;
  private String audioUrl;
  private String imageUrl;
  private String fileUrl;
}

