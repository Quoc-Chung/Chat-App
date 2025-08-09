package com.example.chat_runtime.utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpenApiKey {

  @Value("${openai.api.key}")
  String apiKey;

}
