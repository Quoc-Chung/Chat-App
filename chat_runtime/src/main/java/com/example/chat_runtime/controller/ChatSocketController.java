package com.example.chat_runtime.controller;

import com.example.chat_runtime.config.TokenProvider;
import com.example.chat_runtime.entity.Message;
import com.example.chat_runtime.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatSocketController {

  private final SimpMessagingTemplate messagingTemplate;
  private final TokenProvider tokenProvider;

  @MessageMapping("/private.message")
  public void processPrivateMessage(@Payload Message message,
      @Header("Authorization") String token) {

    if (token == null || !token.startsWith("Bearer ")) {
      throw new IllegalArgumentException("❌ Token thiếu hoặc sai định dạng");
    }

    String senderEmail = tokenProvider.getEmailFromToken(token);
    String receiverEmail = message.getChat().getUsers().stream()
        .filter(u -> !u.getEmail().equals(senderEmail))
        .map(User::getEmail)
        .findFirst()
        .orElse(null);

    if (receiverEmail != null) {

      messagingTemplate.convertAndSendToUser(receiverEmail, "/queue/messages", message);
      System.out.println("📤 Đã gửi tin nhắn đến: " + receiverEmail);
    } else {
      System.err.println("❌ Không tìm thấy người nhận");
    }
  }


  @MessageMapping("/group.message")
  public void processGroupMessage(@Payload Message message,
      @Header("Authorization") String token) {

    String senderEmail = tokenProvider.getEmailFromToken(token);

    if (!message.getChat().isGroup()) {
      throw new IllegalArgumentException("❌ Không phải tin nhắn nhóm");
    }
    messagingTemplate.convertAndSend("/group/" + message.getChat().getId(), message);
  }
}

