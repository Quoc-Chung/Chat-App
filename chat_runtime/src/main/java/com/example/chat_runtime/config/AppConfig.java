package com.example.chat_runtime.config;

import static org.springframework.security.config.Customizer.withDefaults;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AppConfig {
  private  final CorsConfig corsConfig;
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        /* Tắt CSRF vì ứng dụng dạng REST không cần CSRF protection */
        .csrf().disable()

        /* Tắt session: Mỗi request đều phải mang theo token (JWT), không lưu login trong session */
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()

        /* Cấu hình quyền truy cập cho các endpoint */
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll()
        )
        /*- Thêm một bộ lọc trước mỗi requuest -*/
        .addFilterBefore(new JwtAuthenticationFilter(), BasicAuthenticationFilter.class)
        /* ✅ Cho phép dùng login form (không cần thiết nếu dùng JWT nhưng để minh họa vẫn có) */
        .formLogin()
        .and()
        .cors(withDefaults())
        /* ✅ Cho phép basic auth (ví dụ: Authorization: Basic base64(username:password)) */
        .httpBasic();

    return http.build();
  }

  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter();
  }

    @Bean
    public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
    }

}


