package com.example.chat_runtime.controller;

import com.example.chat_runtime.dto.request.UpdateUserRequest;
import com.example.chat_runtime.dto.response.ApiDataResponse;
import com.example.chat_runtime.dto.response.ApiResponse;
import com.example.chat_runtime.dto.response.UpdateResponse;
import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.service.UserService;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  /*- Lấy ra thông tin người dùng dựa trên JWT token -*/
  @GetMapping("/profile")
  public ResponseEntity<User> getUserProfileHandle(@RequestHeader("Authorization") String token){
     User user = userService.findUserProfile(token);
     return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
  }

  @GetMapping("/allprofile")
  public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String token){
    User user = userService.findUserProfile(token);
    if(user == null){
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    List<User> lstUser = userService.getAllUser();
    return new ResponseEntity<>(lstUser, HttpStatus.ACCEPTED);
  }

  /*- Tìm kiếm người dùng theo từ khóa (chưa implement logic tìm kiếm thực sự trong service) -*/
  @GetMapping("/{query}")
  public ResponseEntity<List<User>> searchUserHandler(@RequestHeader("Authorization") String token
      ,@PathVariable("query") String query) {
    User user = userService.findUserProfile(token);
    if(user == null){
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return ResponseEntity.ok(userService.searchUser(query));
  }


  @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiDataResponse<UpdateResponse>> updateUserProfile(
      @RequestPart("data") UpdateUserRequest request,
      @RequestPart(value = "profile_picture", required = false) MultipartFile file,
      @RequestHeader("Authorization") String token
  ) throws Exception {
    User user = userService.findUserProfile(token);
    String filename = null;
    UpdateResponse updateResponse = new UpdateResponse();
    if (file != null && !file.isEmpty()) {
      filename = userService.saveFile(file);

    }
    userService.updateUser(user.getId(), request, filename);

    updateResponse.setFullname(request.getFullname() !=null? request.getFullname() : user.getFullname() );
    updateResponse.setBirthday(request.getBirthday() != null ? request.getBirthday() : user.getBirthday());
    updateResponse.setBio(request.getBio() != null ? request.getBio() : user.getBio());
    updateResponse.setProfilePicture(filename!= null ? filename: user.getProfilePicture() );
    ApiDataResponse response = new ApiDataResponse("Successfully updated user", true, updateResponse);
    return new ResponseEntity<ApiDataResponse<UpdateResponse>>(response, HttpStatus.ACCEPTED);
  }


}
