package com.example.chat_runtime.repository;


import com.example.chat_runtime.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Integer> {

   @Query("SELECT m FROM Message m join m.chat c WHERE c.id = :chatID")
   List<Message> findByChatId(@Param("chatID") Integer chatId);
}
