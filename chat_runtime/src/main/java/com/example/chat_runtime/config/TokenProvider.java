package com.example.chat_runtime.config;

import com.example.chat_runtime.utils.JwtContant;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

/*- Đây cũng giống như hàm jwtutils -*/
@Component
public class TokenProvider {

  private final SecretKey key = Keys.hmacShaKeyFor(JwtContant.JWT_SECRET.getBytes(StandardCharsets.UTF_8));



  public String getEmailFromToken(String token) {
    try {
      if (!token.startsWith("Bearer ")) {
        throw new AuthenticationServiceException("Invalid token format");
      }

      String jwtToken = token.substring(7).trim();

      Claims claims = Jwts.parserBuilder()
          .setSigningKey(key)
          .build()
          .parseClaimsJws(jwtToken)
          .getBody();

      return claims.get("email", String.class);
    } catch (ExpiredJwtException ex) {
      throw ex;
    } catch (JwtException | IllegalArgumentException ex) {
      throw new AuthenticationServiceException("Invalid token", ex);
    }
  }

  public String generateToken(Authentication authentication) {
    return Jwts.builder()
        .setIssuer("Code with")
        .setIssuedAt(Date.from(Instant.now()))
        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
        .claim("email", authentication.getName())
        .claim("authorities", authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(",")))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }



}


