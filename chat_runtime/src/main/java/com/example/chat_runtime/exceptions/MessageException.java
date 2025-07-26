package com.example.chat_runtime.exceptions;


public class MessageException extends RuntimeException {
  public MessageException(String message) {
    super(message);
  }
}