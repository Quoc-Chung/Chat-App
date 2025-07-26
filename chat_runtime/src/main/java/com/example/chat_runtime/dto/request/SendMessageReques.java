package com.example.chat_runtime.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendMessageReques {
     private Integer userId;

     private Integer chatId;

     private String content;
}
