package com.example.chat_runtime.config;

import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import io.micrometer.common.util.StringUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

  private final TokenProvider tokenProvider;
  private final UserRepository userRepository;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

    if (StompCommand.CONNECT.equals(accessor.getCommand())) {

      /*- Token lay ra co dang Bearer {}  -*/
      String authHeader = accessor.getFirstNativeHeader("Authorization");

      if (StringUtils.isBlank(authHeader) || !authHeader.startsWith("Bearer ")) {
        log.error("🚫 Missing or invalid Authorization header");
        throw new AuthenticationCredentialsNotFoundException("Missing or invalid Bearer token");
      }

      try {
        String email = tokenProvider.getEmailFromToken(authHeader);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));


        Authentication auth = new UsernamePasswordAuthenticationToken(
            user.getEmail(),
            null,
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        accessor.setUser(auth);
        log.info("✅ WebSocket CONNECT authenticated for email: {}", email);

      } catch (JwtException | IllegalArgumentException e) {
        log.error("❌ Token validation error: {}", e.getMessage());
        throw new BadCredentialsException("Invalid token");
      }
    }
    else {
    }
    return message;
  }
}
