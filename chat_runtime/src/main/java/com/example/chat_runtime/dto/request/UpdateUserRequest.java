package com.example.chat_runtime.dto.request;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UpdateUserRequest {
    private String fullname;
    private LocalDate birthday;
    private String bio;
}
