package com.example.chat_runtime.config;

import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

  private final TokenProvider tokenProvider;
  private final UserRepository userRepository;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message,
        StompHeaderAccessor.class);
    if (accessor == null) {
      return message;
    }

    StompCommand command = accessor.getCommand();
    log.info("WebSocket command: {}", command);


    if (StompCommand.CONNECT.equals(command) || StompCommand.STOMP.equals(command)) {
      String authHeader = accessor.getFirstNativeHeader("Authorization");
      log.info("Authorization header: {}", authHeader);

      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        log.error("Missing or invalid Authorization header");
        throw new BadCredentialsException("Missing or invalid Authorization header");
      }

      try {
        String token = authHeader.substring(7);
        String email = tokenProvider.getEmailFromToken("Bearer " + token);

        userRepository.findByEmail(email)
            .orElseThrow(() -> new BadCredentialsException("User not found: " + email));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            email,
            null,
            List.of(new SimpleGrantedAuthority("USER"))
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);


        accessor.setUser(authentication);
        log.info("✅ WebSocket authenticated user: {}", email);
      } catch (Exception e) {
        log.error("❌ WebSocket authentication failed: {}", e.getMessage(), e);
        throw new BadCredentialsException("WebSocket authentication failed", e);
      }
    }
    return message;
  }


}


