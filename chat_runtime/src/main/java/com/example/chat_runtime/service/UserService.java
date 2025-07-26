package com.example.chat_runtime.service;

import com.example.chat_runtime.dto.request.UpdateUserRequest;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.UserException;
import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
  User findUserById(Integer id)  throws UserException;
  User findUserProfile (String jwt);

  List<User> getAllUser();
  User updateUser(Integer id, UpdateUserRequest req, String profileFilename) throws UserException;
  String saveFile(MultipartFile file) throws IOException;

  List<User> searchUser(String query);

}
