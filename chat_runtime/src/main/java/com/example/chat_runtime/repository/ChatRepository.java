package com.example.chat_runtime.repository;

import com.example.chat_runtime.entity.Chat;
import com.example.chat_runtime.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

  /**
   * Tìm đoạn chat cá nhân (không phải nhóm) giữa 2 người dùng cụ thể.
   * @param user1 User A là 1 thành viên của đoạn chat
   * @param user2 User B cũng là thành viên của đoạn chat
   * @return hàm này sẽ trả về đoạn chat 1-1 giữa 2 user đã chỉ định.
   */
  @Query("SELECT c FROM Chat c " +
      "WHERE :user1 MEMBER OF c.users " +
      "AND :user2 MEMBER OF c.users " +
      "AND c.isGroup = false")
  Chat findSingleChatByUserId(@Param("user1") User user1, @Param("user2") User user2);

  /**
   * Tìm tất cả các đoạn chat (Chat) mà người dùng có userId tham gia.
   * @param userId id của user
   * @return
   */
  @Query("SELECT c FROM Chat c JOIN c.users u WHERE u.id = :userId")
  List<Chat> findChatByUserId(@Param("userId") Integer userId);


  /**
   * Tìm kiếm xem giữa hai người có tồn tại đoạn chat nào không
   * @param user1Id
   * @param user2Id
   * @return
   */
  @Query("SELECT c FROM Chat c JOIN c.users u1 JOIN c.users u2 WHERE u1.id = :user1 AND u2.id = :user2 AND c.isGroup = false")
  Optional<Chat> findPrivateChatBetween(@Param("user1") Integer user1Id, @Param("user2") Integer user2Id);

}
