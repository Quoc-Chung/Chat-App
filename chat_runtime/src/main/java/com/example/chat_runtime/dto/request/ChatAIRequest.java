package com.example.chat_runtime.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatAIRequest {
   private String sendMessage;
   private MultipartFile audio;
   private MultipartFile image;
   private MultipartFile file;
   /*- Id hội thoại -*/
   private String conversationId;
   private Double temperature;
   private Integer maxTokens;
}