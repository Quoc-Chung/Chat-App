package com.example.chat_runtime.controller;

import com.example.chat_runtime.dto.request.SendMessageReques;
import com.example.chat_runtime.dto.response.ApiResponse;
import com.example.chat_runtime.entity.Message;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.ChatException;
import com.example.chat_runtime.service.MessageService;
import com.example.chat_runtime.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;
  private final UserService userService;

  // Gửi tin nhắn mới
  @PostMapping("/create")
  public ResponseEntity<Message> sendMessageHandle(
      @RequestBody SendMessageReques sendMessageReques,
      @RequestHeader("Authorization") String jwt
  ) throws ChatException {
    User user = userService.findUserProfile(jwt);
    sendMessageReques.setUserId(user.getId());

    Message message = messageService.sendMessage(sendMessageReques);
    return new ResponseEntity<>(message, HttpStatus.OK);
  }

  // Lấy tất cả tin nhắn của đoạn chat
  @GetMapping("/chat/{chatId}")
  public ResponseEntity<List<Message>> getChatsMessageHandle(
      @PathVariable Integer chatId,
      @RequestHeader("Authorization") String jwt
  ) throws ChatException {
    User user = userService.findUserProfile(jwt);
    List<Message> messages = messageService.getChatMessages(chatId, user);
    return new ResponseEntity<>(messages, HttpStatus.OK);
  }

  // Xóa tin nhắn
  @DeleteMapping("/{messageId}")
  public ResponseEntity<ApiResponse> deleteMessageHandle(
      @PathVariable Integer messageId,
      @RequestHeader("Authorization") String jwt
  ) throws ChatException {
    User user = userService.findUserProfile(jwt);
    messageService.deleteMessage(messageId, user);
    return new ResponseEntity<>(new ApiResponse("Message deleted successfully.", true), HttpStatus.OK);
  }
}
