package com.example.chat_runtime.service;

import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.repository.UserRepository;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

  private final UserRepository userRepository;
  private final RestTemplate restTemplate;
  private final PasswordEncoder passwordEncoder;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    log.info("BO MAY CHAY DAY ");
    OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
    OAuth2User oAuth2User = delegate.loadUser(userRequest);

    String provider = userRequest.getClientRegistration().getRegistrationId();
    Map<String, Object> attributes = oAuth2User.getAttributes();

    String email;
    String name;
    String picture;
    String providerId;

    if ("google".equals(provider)) {
      email = (String) attributes.get("email");
      name = (String) attributes.get("name");
      picture = (String) attributes.get("picture");
      providerId = (String) attributes.get("sub");

      log.info("THÔNG TIN GOOGLE: {}, {}, {}", email, name, picture);
    } else if ("github".equals(provider)) {
      providerId = attributes.get("id").toString();
      name = (String) attributes.get("name");
      picture = (String) attributes.get("avatar_url");
      email = "";
      if (attributes.get("email") == null) {

        String token = userRequest.getAccessToken().getTokenValue();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
            "https://api.github.com/user/emails",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<>() {
            }
        );

        List<Map<String, Object>> emails = response.getBody();
        if (emails != null) {
          for (Map<String, Object> mailEntry : emails) {
            Boolean isPrimary = (Boolean) mailEntry.get("primary");
            Boolean isVerified = (Boolean) mailEntry.get("verified");
            if (Boolean.TRUE.equals(isPrimary) && Boolean.TRUE.equals(isVerified)) {
              email = (String) mailEntry.get("email");
              break;
            }
          }
        }
      } else {
        email = (String) attributes.get("email");
      }
      log.info("THÔNG TIN GITHUB: {}, {}, {}", email, name, picture);

    } else {
      throw new OAuth2AuthenticationException("Unsupported provider: " + provider);
    }
    String finalEmail = email;
    if (finalEmail == null || finalEmail.isEmpty()) {
      throw new OAuth2AuthenticationException("Email không thể trống");
    }

    final String encodedPassword = passwordEncoder.encode(UUID.randomUUID().toString());

    userRepository.findByEmail(email).ifPresentOrElse(existingUser -> {
      existingUser.setFullname(name);
      existingUser.setProfilePicture(picture);
      existingUser.setProvider(provider);
      existingUser.setProviderId(providerId);
      userRepository.save(existingUser);
    }, () -> {
      User newUser = User.builder()
          .email(finalEmail)
          .fullname(name)
          .password(encodedPassword)
          .profilePicture(picture)
          .provider(provider)
          .providerId(providerId)
          .build();
      userRepository.save(newUser);
    });

    Map<String, Object> safeAttributes = new HashMap<>(attributes);
    safeAttributes.putIfAbsent("email", email);

    return new DefaultOAuth2User(
        Collections.singleton(new SimpleGrantedAuthority("USER")),
        safeAttributes,
        "email"
    );
  }
}
