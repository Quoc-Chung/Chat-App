package com.example.chat_runtime.controller;

import com.example.chat_runtime.config.TokenProvider;
import com.example.chat_runtime.entity.Message;
import com.example.chat_runtime.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
@Slf4j
@RestController
@RequiredArgsConstructor

public class ChatSocketController {

  private final SimpMessagingTemplate messagingTemplate;
  private final TokenProvider tokenProvider;

  @MessageMapping("/private.message")
  public void processPrivateMessage(@Payload Message message) {
    String authenticatedEmail = message.getUser().getEmail();
    log.info("email ngươi gui {}", authenticatedEmail);
    String receiverEmail = message.getChat().getUsers().stream()
        .map(User::getEmail)
        .filter(email -> !email.equals(authenticatedEmail))
        .findFirst().orElse(null);
    log.info("email nguoi nhan {}", receiverEmail);
    if (receiverEmail == null) {
      log.warn("❌ Không tìm thấy người nhận trong cuộc trò chuyện");
      return;
    }
    log.info("tin nhan : {}", message.getContent());
    messagingTemplate.convertAndSendToUser(receiverEmail, "/queue/messages", message);
    log.info("📤 Tin nhắn từ {} gửi đến {}", authenticatedEmail, receiverEmail);
  }

  @MessageMapping("/group.message")
  public void processGroupMessage(@Payload Message message) {
    /*- Người gửi -*/
    String senderEmail = message.getUser().getEmail();

    if (!message.getChat().isGroup()) {
      throw new IllegalArgumentException("❌ Không phải tin nhắn nhóm");
    }
    messagingTemplate.convertAndSend("/group/" + message.getChat().getId(), message);
    log.info("📨 {} gửi tin nhắn nhóm tới groupId {}", senderEmail, message.getChat().getId());
  }

}

