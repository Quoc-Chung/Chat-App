package com.example.chat_runtime.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiDataResponse<T> {
  private String message;
  private boolean status;
  private T data;

}
