package com.example.chat_runtime.service;

import jakarta.annotation.PostConstruct;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AsyncEmailService {

  private final JavaMailSender mailSender;
  private final BlockingQueue<SimpleMailMessage> queue = new LinkedBlockingQueue<>();

  @PostConstruct
  public void start() {
    Thread thread = new Thread(() -> {
      while (true) {
        try {
          SimpleMailMessage message = queue.take();
          mailSender.send(message);
          System.out.println("✅ Email sent: " + message.getTo()[0]);
        } catch (InterruptedException e) {
          break;
        } catch (Exception e) {
          System.err.println("❌ Gửi email thất bại: " + e.getMessage());
        }
      }
    });
    thread.setName("async-mail-sender");
    thread.setDaemon(true);
    thread.start();
  }

  public void sendAsync(String to, String subject, String text) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject(subject);
    message.setText(text);
    queue.offer(message);
  }

  public void sendAsync(String to, String otp) {
    String subject = "Mã OTP Đặt Lại Mật Khẩu - Chat App ";

    String content = """
        Xin chào,

        Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản tại Chat App .

        🔐 Mã OTP của bạn là: %s

        ⏰ Mã này sẽ hết hạn sau 5 phút.

        Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.

        Trân trọng,
        Đội ngũ Chat App !
    """.formatted(otp);

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setFrom("Chat App  <no-reply@gaubong.vn>");
    message.setSubject(subject);
    message.setText(content);
    queue.offer(message);
  }

}