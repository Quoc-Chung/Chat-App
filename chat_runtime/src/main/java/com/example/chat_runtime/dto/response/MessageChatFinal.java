package com.example.chat_runtime.dto.response;


import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageChatFinal {
    private Integer chat_id;
    private String final_content;
    private String nameSendFinalMessage;
    private String emailSendFinalMessage;
    private String typeChatMessage; // private or group
    private String audio;
    private String type;
    private LocalDateTime timestamp;
}