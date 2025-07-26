package com.example.chat_runtime.service;

import com.example.chat_runtime.dto.request.ResetPasswordRequest;
import com.example.chat_runtime.dto.request.SendOtpRequest;
import com.example.chat_runtime.dto.request.VerifyOtpRequest;
import com.example.chat_runtime.dto.response.AuthResponse;
import com.example.chat_runtime.dto.response.OtpResponse;
import com.example.chat_runtime.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface AuthService {



  ResponseEntity<OtpResponse> sendOtp(SendOtpRequest request);
  ResponseEntity<OtpResponse> verifyOtp(VerifyOtpRequest request);
  ResponseEntity<OtpResponse> resetPassword(ResetPasswordRequest request);
}
