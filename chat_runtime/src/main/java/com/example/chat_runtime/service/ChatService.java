package com.example.chat_runtime.service;

import com.example.chat_runtime.dto.request.GroupChatRequest;
import com.example.chat_runtime.entity.Chat;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.ChatException;
import com.example.chat_runtime.exceptions.UserException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;


public interface ChatService {
      /*- Tạo chat -*/
       Chat createChat(User reqUser , Integer userId2) throws UserException;

       Chat findChatById(Integer id) throws ChatException;

       List<Chat> findAllChatByUserId(Integer userId) throws UserException;

       Chat createGroup(GroupChatRequest req , User reqUser, String filename) throws  UserException;

       String  saveFile(MultipartFile file) throws IOException;


       Chat addUserToGroup (Integer userId, Integer chatId, User reqUser) throws UserException, ChatException;

       Chat renameGroup(Integer chatId, String groupName, User reqUser) throws UserException,ChatException;

       Chat removeUserFromGroup(Integer chatId, Integer userId, User reqUser) throws  UserException , ChatException;

       void deleteChat(Integer chatId, Integer userId) throws ChatException  , UserException;
}
