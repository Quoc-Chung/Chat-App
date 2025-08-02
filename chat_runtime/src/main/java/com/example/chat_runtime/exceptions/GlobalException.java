package com.example.chat_runtime.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalException {

  @ExceptionHandler(UserException.class)
  public ResponseEntity<ErrorDetail> handleUserException(UserException e, WebRequest req) {
    ErrorDetail errorDetail = new ErrorDetail("User Error", e.getMessage(), LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MessageException.class)
  public ResponseEntity<ErrorDetail> handleMessageException(MessageException e, WebRequest req) {
    ErrorDetail errorDetail = new ErrorDetail("Message Error", e.getMessage(), LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorDetail> handleValidationException(MethodArgumentNotValidException e, WebRequest req) {
    String error = e.getBindingResult().getFieldError().getDefaultMessage();
    ErrorDetail errorDetail = new ErrorDetail("Validation Error", error, LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<ErrorDetail> handleNoHandlerFound(NoHandlerFoundException e, WebRequest req) {
    ErrorDetail errorDetail = new ErrorDetail("Endpoint Not Found", req.getDescription(false), LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDetail> handleOtherExceptions(Exception e, WebRequest req) {
    ErrorDetail errorDetail = new ErrorDetail("Generic Error", e.getMessage(), LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(ChatException.class)
  public ResponseEntity<ErrorDetail> handleChatException(ChatException e, WebRequest req) {
    ErrorDetail errorDetail = new ErrorDetail("Message Error", e.getMessage(), LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorDetail> handleBadCredentials(BadCredentialsException ex, WebRequest req) {
    ErrorDetail errorDetail = new ErrorDetail("Authentication Error", ex.getMessage(), LocalDateTime.now());
    return new ResponseEntity<>(errorDetail, HttpStatus.UNAUTHORIZED); // ✅ 401
  }



}
