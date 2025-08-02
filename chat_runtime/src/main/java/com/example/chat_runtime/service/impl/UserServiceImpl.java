package com.example.chat_runtime.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.chat_runtime.config.TokenProvider;
import com.example.chat_runtime.dto.request.UpdateUserRequest;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.UserException;
import com.example.chat_runtime.repository.UserRepository;
import com.example.chat_runtime.service.UserService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final TokenProvider tokenProvider;

  private final Cloudinary cloudinary;

  @Override
  public User findUserById(Integer id) throws UserException {
    Optional<User> user = userRepository.findById(id);
    if (user.isPresent()) {
      return user.get();
    }
    throw new UserException("User not found with id" + id);
  }

  @Override
  public User findUserProfile(String jwt) {
    String email = tokenProvider.getEmailFromToken(jwt);
    if (email == null) {
      throw new BadCredentialsException("Reciver invalid token");
    }
    Optional<User> user = userRepository.findByEmail(email);
    if (user.isEmpty()) {
      throw new UserException("User not found width email : " + email);
    }
    return user.get();
  }

  @Override
  public List<User> getAllUser() {
    return userRepository.findAll();
  }


  @Override
  public User updateUser(Integer id, UpdateUserRequest req, String profileFilename)
      throws UserException {
    User user = findUserById(id);

    if (req.getFullname() != null) {
      user.setFullname(req.getFullname());
    }
    if (req.getBirthday() != null) {
      user.setBirthday(req.getBirthday());
    }
    if (req.getBio() != null) {
      user.setBio(req.getBio());
    }
    if (profileFilename != null) {
      user.setProfilePicture(profileFilename);
    }
    return userRepository.save(user);
  }

  @Override
  public List<User> searchUser(String query) {
    if (query == null || query.isEmpty()) {
      return List.of();
    }
    return userRepository.searchUser(query.trim());
  }


  @Override
  public String saveFile(MultipartFile file) throws IOException {
    try {
      Map<String, Object> options = ObjectUtils.asMap(
          "folder", "profile_pictures",
          "quality", "auto",
          "fetch_format", "auto",
          "use_filename", true,
          "unique_filename", true,
          "overwrite", false
      );

      Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
      return uploadResult.get("secure_url").toString();
    } catch (IOException e) {
      throw new IOException("Upload file thất bại: " + e.getMessage());
    }
  }

}
