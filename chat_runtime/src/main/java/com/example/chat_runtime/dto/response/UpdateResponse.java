package com.example.chat_runtime.dto.response;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateResponse {
  private String fullname;
  private LocalDate birthday;
  private String bio;
  private String profilePicture;

}
