package com.example.chat_runtime.repository;

import com.example.chat_runtime.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
  Optional<User> findByEmail(String email);
  /**
   * search user by full name
   * @param keyword
   * @return
   */
  @Query("SELECT u FROM User u WHERE u.fullname LIKE CONCAT('%', :keyword, '%') OR u.email LIKE CONCAT('%', :keyword, '%')")
  List<User> searchUser(@Param("keyword") String keyword);

}
