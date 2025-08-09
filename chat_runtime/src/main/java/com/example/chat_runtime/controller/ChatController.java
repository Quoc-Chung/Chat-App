package com.example.chat_runtime.controller;

import com.example.chat_runtime.dto.request.ChatAIRequest;
import com.example.chat_runtime.dto.request.GroupChatRequest;
import com.example.chat_runtime.dto.request.SingleChatRequest;
import com.example.chat_runtime.dto.response.ApiResponse;
import com.example.chat_runtime.dto.response.ChatAiResponse;
import com.example.chat_runtime.dto.response.MessageChatFinal;
import com.example.chat_runtime.entity.Chat;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.ChatException;
import com.example.chat_runtime.service.ChatService;
import com.example.chat_runtime.service.MessageService;
import com.example.chat_runtime.service.UserService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
  private final ChatService chatService;
  private final UserService userService;
  private final MessageService messageService;

  @PostMapping("/singlechat")
  public ResponseEntity<Chat> createChatHandle(@RequestBody SingleChatRequest singleChatRequest , @RequestHeader("Authorization") String jwt){
    User reqUser = userService.findUserProfile(jwt);
    Chat chat = chatService.createChat(reqUser, singleChatRequest.getUserId());
    return new ResponseEntity<>(chat, HttpStatus.CREATED);
  }

  /**
   * Create obe  group chat
   * @param req (List<Integer> userIds , String chatName )
   * @param jwt
   * @return CHAT
   */
  @PostMapping(value = "/group", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Chat> createGroupHandle(
      @RequestPart(value="data") GroupChatRequest req,
      @RequestPart(value = "chat_image", required = false) MultipartFile file,
      @RequestHeader("Authorization") String jwt) throws IOException {
    User reqUser = userService.findUserProfile(jwt);
    String filename = null;
    if (file != null && !file.isEmpty()) {
      filename = chatService.saveFile(file);
  }

    Chat createGroupChat = chatService.createGroup(req, reqUser, filename);
    return new ResponseEntity<>(createGroupChat, HttpStatus.CREATED);
  }

  @PostMapping("/renames_group")
  public ResponseEntity<?> renameGroupHandle(@RequestBody GroupChatRequest req,
      @RequestHeader("Authorization") String jwt){
     return  ResponseEntity.ok("");
  }


  @GetMapping("/{chatId}")
  public ResponseEntity<Chat> findChatByIdHandle(@PathVariable Integer chatId,
      @RequestHeader("Authorization") String jwt)  throws ChatException {
    User reqUser = userService.findUserProfile(jwt);
    Chat chat = chatService.findChatById(chatId);
    return new ResponseEntity<>(chat, HttpStatus.OK);
  }


  @GetMapping("/user")
  public ResponseEntity<List<Chat>> getAllChatById(@RequestHeader("Authorization") String jwt)  throws ChatException {
    User reqUser = userService.findUserProfile(jwt);
    List<Chat> chats  = chatService.findAllChatByUserId(reqUser.getId());
    return new ResponseEntity<>(chats, HttpStatus.OK);
  }

  @GetMapping("/messageFinal/{chatId}")
  public ResponseEntity<MessageChatFinal> getChatMessageFinal(
      @RequestHeader("Authorization") String jwt,
      @PathVariable Integer chatId)  throws ChatException {
      User reqUser = userService.findUserProfile(jwt);
      Chat chat = chatService.findChatById(chatId);

      MessageChatFinal result = chatService.findChatMessageFinal(reqUser, chat);
      return new  ResponseEntity<>(result, HttpStatus.OK);
  }

  @GetMapping ("/listmessagefinal")
  public ResponseEntity<List<MessageChatFinal>> getChatMessageFinalList(
      @RequestHeader("Authorization") String jwt
  ) throws ChatException {
    User reqUser = userService.findUserProfile(jwt);
    /*- Lấy ra tất cả đoạn chat của một người -*/
    List<Chat> chats  = chatService.findAllChatByUserId(reqUser.getId());
    List<MessageChatFinal> lstMessageFinal = new ArrayList<>();
    for(Chat chat : chats){
      lstMessageFinal.add(chatService.findChatMessageFinal(reqUser, chat));
    }
     return new ResponseEntity<>(lstMessageFinal, HttpStatus.OK);
  }

    @PutMapping("{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroupHandle(@PathVariable Integer chatId, @PathVariable Integer userId,
        @RequestHeader("Authorization") String jwt) throws ChatException {
      User reqUser = userService.findUserProfile(jwt);
      Chat chats = chatService.addUserToGroup(userId, chatId,reqUser);
      return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @PutMapping("{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroupHandle(@PathVariable Integer chatId, @PathVariable Integer userId,
        @RequestHeader("Authorization") String jwt) throws ChatException {
      User reqUser= userService.findUserProfile(jwt);
      Chat chats = chatService.removeUserFromGroup(chatId,userId,reqUser);
      return new ResponseEntity<>(chats, HttpStatus.OK);
  }

  @PutMapping("delete/{chatId}")
  public ResponseEntity<ApiResponse> removeUserFromGroupHandle(@PathVariable Integer chatId,
      @RequestHeader("Authorization") String jwt) throws ChatException {
    User reqUser = userService.findUserProfile(jwt);
    chatService.deleteChat(chatId, reqUser.getId());
    ApiResponse apiResponse = new ApiResponse("Xoa đoan chat thanh cong", true);
    return new ResponseEntity<>(apiResponse, HttpStatus.OK);
  }

  @PostMapping(value = "/chat_ai", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ChatAiResponse> chat(
      @RequestPart(value = "sendMessage", required = false) String sendMessage,
      @RequestPart(value = "audio", required = false) MultipartFile audio,
      @RequestPart(value = "image", required = false) MultipartFile image,
      @RequestPart(value = "file", required = false) MultipartFile file,
      @RequestParam(value = "temperature", required = false) Double temperature,
      @RequestParam(value = "maxTokens", required = false) Integer maxTokens,
      @RequestHeader("Authorization") String jwt) {
    User reqUser = userService.findUserProfile(jwt);
    ChatAIRequest request = new ChatAIRequest();
    request.setSendMessage(sendMessage);
    request.setAudio(audio);
    request.setImage(image);
    request.setFile(file);
    request.setConversationId(reqUser.getId().toString());
    request.setTemperature(temperature);
    request.setMaxTokens(maxTokens);

    ChatAiResponse response = chatService.chatAI(request);
    return ResponseEntity.ok(response);
  }
}
