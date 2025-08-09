package com.example.chat_runtime.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.chat_runtime.dto.request.ChatAIRequest;
import com.example.chat_runtime.dto.request.GroupChatRequest;
import com.example.chat_runtime.dto.response.ChatAiResponse;
import com.example.chat_runtime.dto.response.MessageChatFinal;
import com.example.chat_runtime.entity.Chat;
import com.example.chat_runtime.entity.Message;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.ChatException;
import com.example.chat_runtime.exceptions.UserException;
import com.example.chat_runtime.repository.ChatRepository;
import com.example.chat_runtime.repository.UserRepository;
import com.example.chat_runtime.service.ChatService;
import com.example.chat_runtime.service.UserService;
import com.example.chat_runtime.utils.MultipartInputStreamFileResource;
import com.example.chat_runtime.utils.OpenApiKey;
import com.example.chat_runtime.utils.SystemText;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.content.Media;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl  implements ChatService {
  private static final Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);
  private final Cloudinary cloudinary;
  private final ChatRepository chatRepository;

  private final UserService userService;
  private final UserRepository userRepository;

  private final ChatClient chatClient;
  private final RestTemplate restTemplate;



  /**
   * Tạo đoạn chat riêng tư (1-1) giữa người gửi (reqUser) và người nhận (userId2)
   * Nếu đoạn chat đã tồn tại, trả về đoạn chat đó.
   * Nếu chưa có, tạo mới đoạn chat và thêm cả hai người dùng vào.
   */
  @Override
  public Chat createChat(User reqUser, Integer userId2) throws UserException {
    User otherUser = userService.findUserById(userId2);

    // Kiểm tra xem chat giữa 2 user đã tồn tại chưa
    Chat existingChat = chatRepository.findSingleChatByUserId(reqUser, otherUser);
    if (existingChat != null) {
      return existingChat;
    }

    // Tạo mới
    Chat chat = new Chat();
    chat.setGroup(false); // đây là chat 1-1
    chat.setCreatedBy(reqUser);
    chat.getUsers().add(reqUser);
    chat.getUsers().add(otherUser);
    return chatRepository.save(chat);
  }


  /**
   * Tìm một đoạn chat theo ID.
   * Nếu không tìm thấy thì ném ChatException.
   */
  @Override
  public Chat findChatById(Integer id) throws ChatException {
    return chatRepository.findById(id)
        .orElseThrow(() -> new ChatException("Chat not found with id: " + id));
  }


  /**
   * Trả về danh sách tất cả đoạn chat mà người dùng tham gia
   * (bao gồm cả chat nhóm và chat 1-1).
   */
  @Override
  public List<Chat> findAllChatByUserId(Integer userId) throws UserException, ChatException {
    User user = userService.findUserById(userId);
    List<Chat> chats =  chatRepository.findChatByUserId(user.getId());
    return chats;
  }

  /**
   * Tạo đoạn chat nhóm mới.
   * - Người tạo là admin (reqUser)
   * - Thêm các thành viên vào nhóm dựa trên danh sách userId được gửi trong request.
   * - Có thể đặt tên nhóm và ảnh đại diện nhóm.
   */
  public Chat createGroup(GroupChatRequest req, User reqUser, String filename) throws UserException {
    Chat chat_group = new Chat();
    chat_group.setGroup(true);
    chat_group.setChatImage(filename != null ? filename : "");
    chat_group.setChatName(req.getChatName());
    chat_group.setCreatedBy(reqUser);
    chat_group.getAdmins().add(reqUser);

    for (Integer userId : req.getUserIds()) {
      User user = userService.findUserById(userId);
      chat_group.getUsers().add(user);
    }
    chat_group.getUsers().add(reqUser);

    return chatRepository.save(chat_group);
  }


  @Override
  public  String saveFile(MultipartFile file) throws IOException {
    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
    return uploadResult.get("secure_url").toString();
  }

  /**
   * Thêm một người mới userId vào nhóm chat (chat Id) - nhưng chỉ admin mới có quyền thêm)
   * @param userId  ID của người dùng cần thêm vào nhóm.
   * @param chatId  iD của đoạn chat (nhóm).
   * @param reqUser  người dùng hiện tại (người gửi yêu cầu).
   * @return
   * @throws UserException
   * @throws ChatException
   */
  @Override
  public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser)
      throws UserException, ChatException {

    Chat chat = chatRepository.findById(chatId)
        .orElseThrow(() -> new ChatException("Chat not found with id: " + chatId));
    if (!chat.getAdmins().contains(reqUser)) {
      throw new UserException("You are not an admin of this group.");
    }
    User user = userService.findUserById(userId);
    chat.getUsers().add(user);
    return chatRepository.save(chat);
  }

  /**
   * Đổi tên đoạn chat nhóm (group chat)
   * Chỉ thành viên của nhóm mói được phép đổi tên.
   * @param chatId :
   * @param groupName : Đoạn chat
   * @param reqUser : Người yêu cầu đổi tên
   * @return
   * @throws UserException
   * @throws ChatException
   */
  @Override
  public Chat renameGroup(Integer chatId, String groupName, User reqUser)
      throws UserException, ChatException {

    Chat chat = chatRepository.findById(chatId)
        .orElseThrow(() -> new ChatException("Chat not found with id: " + chatId));

    // Kiểm tra xem reqUser có trong nhóm không
    if (!chat.getUsers().contains(reqUser)) {
      throw new UserException("You are not a member of this group.");
    }

    chat.setChatName(groupName);
    return chatRepository.save(chat);
  }



  /**
   * Xóa một người dùng khỏi đoạn chat nhóm (chat Id)
   *   + Nếu người yêu cầu xóa là admin -> Được phép xóa bất kì user nào
   *   + Nếu người yêu cầu không phải admin, nhưng muốn tự rời khỏi nhóm -> Cho phép
   *   + Nếu không phải admin mà muốn có gắng xóa người khác thì bị từ chối.
   * @param chatId : đoạn chat
   * @param userId : Id của người sẽ bị xóa
   * @param reqUser : Người yêu cầu xóa
   * @return
   * @throws UserException
   * @throws ChatException
   */
  @Override
  public Chat removeUserFromGroup(Integer chatId, Integer userId, User reqUser)
      throws UserException, ChatException {

    Chat chat = chatRepository.findById(chatId)
        .orElseThrow(() -> new ChatException("Chat not found with id: " + chatId));

    User userToRemove = userService.findUserById(userId);

    if (chat.getAdmins().contains(reqUser)) {
      chat.getUsers().remove(userToRemove);
      return chatRepository.save(chat);
    }


    if (reqUser.getId().equals(userId) && chat.getUsers().contains(reqUser)) {
      chat.getUsers().remove(reqUser);
      return chatRepository.save(chat);
    }

    throw new UserException("You are not allowed to remove other users from the group.");
  }



  @Override
  public void deleteChat(Integer chatId, Integer userId) throws ChatException, UserException {
    Chat chat = chatRepository.findById(chatId)
        .orElseThrow(() -> new ChatException("Chat not found with id: " + chatId));
    chatRepository.deleteById(chat.getId());
  }


  @Override
  public MessageChatFinal findChatMessageFinal(User reqUser, Chat chat) {
    MessageChatFinal messageChatFinal = new MessageChatFinal();

    List<Message> messages = chat.getMessages();
    if (messages == null || messages.isEmpty()) {
      return null;
    }
    Message message = messages.get(messages.size() - 1);
    messageChatFinal.setChat_id(chat.getId());
    messageChatFinal.setFinal_content(message.getContent());
    messageChatFinal.setNameSendFinalMessage(message.getUser().getFullname());
    messageChatFinal.setEmailSendFinalMessage(message.getUser().getEmail());
    if(chat.isGroup()){
      messageChatFinal.setTypeChatMessage("group");
    }
    else{
      messageChatFinal.setTypeChatMessage("individual");
    }
    messageChatFinal.setTimestamp(message.getTimestamp());
    return messageChatFinal;
  }

  @Override
  public ChatAiResponse chatAI(ChatAIRequest chatRequest) {
    if (chatRequest == null ||
        (isEmpty(chatRequest.getSendMessage()) &&
         isFileEmpty(chatRequest.getAudio()) &&
         isFileEmpty(chatRequest.getImage()) &&
         isFileEmpty(chatRequest.getFile()))) {
      logger.warn("Yêu cầu không hợp lệ. Thiếu nội dung.");
      return new ChatAiResponse(
          "Bạn ơi, gửi tớ một tin nhắn, file âm thanh, hình ảnh hoặc tài liệu gì đó nhé!",
          null, null, null
      );
    }
    String audioUrl = null;
    String imageUrl = null;
    String fileUrl = null;
    List<Media> medias = new ArrayList<>();
    try {
      if (!isFileEmpty(chatRequest.getAudio())) {
        audioUrl = saveFile(chatRequest.getAudio());
        medias.add(Media.builder()
            .mimeType(MimeTypeUtils.parseMimeType(chatRequest.getAudio().getContentType()))
            .data(chatRequest.getAudio().getResource())
            .build());
      }
      if (!isFileEmpty(chatRequest.getImage())) {
        imageUrl = saveFile(chatRequest.getImage());
        medias.add(Media.builder()
            .mimeType(MimeTypeUtils.parseMimeType(chatRequest.getImage().getContentType()))
            .data(chatRequest.getImage().getResource())
            .build());
      }
      if (!isFileEmpty(chatRequest.getFile())) {
        fileUrl = saveFile(chatRequest.getFile());
        medias.add(Media.builder()
            .mimeType(MimeTypeUtils.parseMimeType(chatRequest.getFile().getContentType()))
            .data(chatRequest.getFile().getResource())
            .build());
      }
      String conversationId = chatRequest.getConversationId() != null
          ? chatRequest.getConversationId()
          : UUID.randomUUID().toString();

      org.springframework.ai.chat.messages.Message systemMessage =
          new SystemPromptTemplate(SystemText.systemText).createMessage(Map.of());

      ChatOptions chatOptions = ChatOptions.builder()
          .temperature(chatRequest.getTemperature() != null ? chatRequest.getTemperature() : 0.6)
          .maxTokens(chatRequest.getMaxTokens() != null ? chatRequest.getMaxTokens() : 1000)
          .build();

      String userMessageText = chatRequest.getSendMessage();

      if (isEmpty(userMessageText) && !medias.isEmpty()) {
        userMessageText = "Cái này tôi vừa gửi là gì?";
      }
      UserMessage userMessage = UserMessage.builder()
          .text(userMessageText)
          .media(medias)
          .build();
      Prompt prompt = new Prompt(List.of(systemMessage, userMessage), chatOptions);
      String response = chatClient
          .prompt(prompt)
          .advisors(advisor -> advisor.param(ChatMemory.CONVERSATION_ID, conversationId))
          .call()
          .content();

      logger.info("Phản hồi từ AI (conversationId={}): {}", conversationId, response);

      return new ChatAiResponse(response, audioUrl, imageUrl, fileUrl);

    } catch (IOException e) {
      logger.error("Lỗi xử lý file hoặc gọi AI: {}", e.getMessage(), e);
      return new ChatAiResponse(
          "Tớ gặp lỗi khi xử lý file hoặc gọi AI. Bạn thử lại sau nhé!",
          audioUrl, imageUrl, fileUrl
      );
    }
  }

  private boolean isEmpty(String text) {
    return text == null || text.trim().isEmpty();
  }

  private boolean isFileEmpty(MultipartFile file) {
    return file == null || file.isEmpty();
  }


}
