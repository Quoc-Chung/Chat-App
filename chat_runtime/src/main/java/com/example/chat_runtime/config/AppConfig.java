package com.example.chat_runtime.config;

import static org.springframework.security.config.Customizer.withDefaults;


import com.example.chat_runtime.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AppConfig {
  private final CustomOAuth2UserService customOAuth2UserService;
  private final OAuth2SuccessHandler oAuth2SuccessHandler;
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http

        .csrf().disable()


        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()


        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll()
        )
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo -> userInfo
                .userService(customOAuth2UserService))
            .successHandler(oAuth2SuccessHandler)
            .loginPage("/signin")
        )
        .addFilterBefore(new JwtAuthenticationFilter(), BasicAuthenticationFilter.class)

        .formLogin()
        .and()
        .cors(withDefaults())
        .httpBasic();

    return http.build();
  }

  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter();
  }






}


