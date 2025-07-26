package com.example.chat_runtime.service.impl;

import com.example.chat_runtime.dto.request.SendMessageReques;
import com.example.chat_runtime.entity.Chat;
import com.example.chat_runtime.entity.Message;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.ChatException;
import com.example.chat_runtime.exceptions.MessageException;
import com.example.chat_runtime.exceptions.UserException;
import com.example.chat_runtime.repository.MessageRepository;
import com.example.chat_runtime.service.ChatService;
import com.example.chat_runtime.service.MessageService;
import com.example.chat_runtime.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

  private final MessageRepository messageRepository;
  private final UserService userService;
  private final ChatService chatService;

  /*- gửi một tin nhắn mới từ một user cụ thể trong 1 đoạn chat cụ thể -*/
  @Override
  public Message sendMessage(SendMessageReques request) throws UserException, ChatException {

    User user = userService.findUserById(request.getUserId());
    Chat chat = chatService.findChatById(request.getChatId());

    Message message_send = new Message();
    message_send.setUser(user);
    message_send.setChat(chat);
    message_send.setContent(request.getContent());
    message_send.setTimestamp(LocalDateTime.now());
    return messageRepository.save(message_send);
  }

  /**
   * Trả ra một danh sách tin nhắn của đoạn chat nếu user được phép xem
   * User chỉ được phép xem khi  đoạn chat đó chứa user đó
   * @param chatId
   * @param reqUser
   * @return
   * @throws ChatException
   * @throws UserException
   */
  @Override
  public List<Message> getChatMessages(Integer chatId , User reqUser) throws ChatException, UserException {
    Chat chat = chatService.findChatById(chatId);
    if(!chat.getUsers().contains(reqUser)) {
      throw new UserException("Bạn không được tham gia cuộc trò chuyện này. " + chat.getId());
    }
    List<Message> message = messageRepository.findByChatId(chatId);
    return message;
  }

  /**
   * Tìm tin nhắn theo ID. Nếu không có thì ném MessageException.
   * @param messageId
   * @return
   * @throws MessageException
   */
  @Override
  public Message findMessageById(Integer messageId) throws MessageException {
      Optional<Message> message = messageRepository.findById(messageId);
      if(message.isPresent()) {
        return message.get();
      }
      throw new MessageException("message not found with id " + messageId);
  }

  /**
   * @param messageId
   * @param userReq
   * @return
   * @throws MessageException
   * @throws UserException
   */
  @Override
  public Message deleteMessage(Integer messageId, User userReq) throws MessageException,UserException {
    Message message = findMessageById(messageId);
    /*- Check xem tin nhan co phai cua minh gui khong -*/
    if(!message.getUser().getId().equals(userReq.getId())) {
      throw new UserException("Bạn không thể xóa tin nhắn của người khác: " + userReq.getFullname());
    }
    messageRepository.deleteById(messageId);

    return message;
  }
}
