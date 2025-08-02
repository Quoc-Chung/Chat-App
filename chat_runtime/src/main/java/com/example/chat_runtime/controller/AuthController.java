package com.example.chat_runtime.controller;

import com.example.chat_runtime.config.TokenProvider;
import com.example.chat_runtime.dto.request.LoginRequest;
import com.example.chat_runtime.dto.request.ResetPasswordRequest;
import com.example.chat_runtime.dto.request.SendOtpRequest;
import com.example.chat_runtime.dto.request.VerifyOtpRequest;
import com.example.chat_runtime.dto.response.AuthResponse;
import com.example.chat_runtime.dto.response.OtpResponse;

import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.exceptions.UserException;
import com.example.chat_runtime.repository.UserRepository;
import com.example.chat_runtime.service.AuthService;
import com.example.chat_runtime.service.CustomUserService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
   private final TokenProvider tokenProvider;
   private final CustomUserService customUserService;
   private final AuthService authService;




  /*- Đăng kí -*/
  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> createUserHandle(@RequestBody User user){
    String email = user.getEmail();
    String fullname = user.getFullname();
    String password = user.getPassword();

    Optional<User> isUser = userRepository.findByEmail(email);
    if(!isUser.isEmpty()){
      throw new UserException("Email is used with another account: " + email);
    }
    User createdUser = new User();
    createdUser.setEmail(email);
    createdUser.setFullname(fullname);
    createdUser.setPassword(passwordEncoder.encode(password));
    userRepository.save(createdUser);

    Authentication auth = authenticate(email, password);
    SecurityContextHolder.getContext().setAuthentication(auth);
    String token = tokenProvider.generateToken(auth);
    AuthResponse authResponse = new AuthResponse(token , true);
    return new ResponseEntity<>(authResponse, HttpStatus.OK);
  }

  @PostMapping("/signin")
   public ResponseEntity<AuthResponse> loginHandle(@RequestBody LoginRequest user){
     String email = user.getEmail();
     String password = user.getPassword();
     Authentication authentication = authenticate(email, password);
     SecurityContextHolder.getContext().setAuthentication(authentication);
     String jwt = tokenProvider.generateToken(authentication);
     AuthResponse authResponse = new AuthResponse(jwt , true);
     return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
   }

   public Authentication authenticate(String usename, String password){
     UserDetails userDetails = customUserService.loadUserByUsername(usename);

     if(userDetails == null){
       throw new BadCredentialsException("invalid username");
     }
     if(!passwordEncoder.matches(password, userDetails.getPassword())) {
       throw new BadCredentialsException("invalid password");
     }
     return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
   }
   /*==================================================================================================================*/


   @PostMapping("/forgot-password")
  public ResponseEntity<OtpResponse> sendOtp(@RequestBody SendOtpRequest request) {
    return authService.sendOtp(request);
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<OtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
    return authService.verifyOtp(request);
  }

  @PostMapping("/reset-password")
  public ResponseEntity<OtpResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
    return authService.resetPassword(request);
  }

}
