package com.example.chat_runtime.service;

import com.example.chat_runtime.dto.request.SendMessageReques;
import com.example.chat_runtime.entity.Message;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.ChatException;
import com.example.chat_runtime.exceptions.MessageException;
import com.example.chat_runtime.exceptions.UserException;
import java.util.List;

public interface MessageService {

  Message sendMessage(SendMessageReques message) throws UserException, ChatException;

  List<Message> getChatMessages(Integer chatId, User userReq) throws  ChatException, UserException;

  Message findMessageById (Integer messageId) throws MessageException;

  Message deleteMessage(Integer messageId,User userReq ) throws MessageException, UserException;

}
