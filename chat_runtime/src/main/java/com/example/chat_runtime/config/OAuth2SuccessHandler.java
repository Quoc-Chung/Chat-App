package com.example.chat_runtime.config;

import com.example.chat_runtime.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final TokenProvider jwtProvider;
  private final UserRepository userRepository;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    log.info("THONG TIN LAY  VE: {}", oAuth2User);
    String email = oAuth2User.getAttribute("email");
   log.info("EMAIL SUCCESS : {}", email);
    if (email == null) {
      throw new RuntimeException("Không thể lấy email từ OAuth2 provider!");
    }

    userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    UserDetails userDetails = new org.springframework.security.core.userdetails.User(
        email,
        "",
        List.of(new SimpleGrantedAuthority("USER"))
    );

    UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities()
    );

    String token = jwtProvider.generateToken(newAuth);

    log.info("token gui ve client: {}", token);
    response.sendRedirect("http://localhost:5173/oauth2-success?token=" + token);
  }
}


