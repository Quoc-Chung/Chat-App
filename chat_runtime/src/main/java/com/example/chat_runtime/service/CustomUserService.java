package com.example.chat_runtime.service;

import com.example.chat_runtime.entity.User;
import com.example.chat_runtime.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserService implements UserDetailsService {

  private final UserRepository userRepository;
  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Optional<User> user = userRepository.findByEmail(email);
    if (user.isEmpty()) {
      throw new UsernameNotFoundException("User notfound with email: "  + email );
    }
    List<GrantedAuthority> authorities = new ArrayList<>();
    return new org.springframework.security.core.userdetails.User(user.get().getEmail(), user.get().getPassword(), authorities);
  }
}
