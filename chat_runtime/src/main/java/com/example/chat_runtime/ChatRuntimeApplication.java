package com.example.chat_runtime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class ChatRuntimeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatRuntimeApplication.class, args);
	}

}
