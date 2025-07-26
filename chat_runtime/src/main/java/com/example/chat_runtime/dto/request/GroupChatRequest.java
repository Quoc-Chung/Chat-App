package com.example.chat_runtime.dto.request;


import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupChatRequest {
     /*- Danh sách người thêm vào nhóm -*/
     private List<Integer> userIds;
     /*- Tên nhóm -*/
     private String chatName;

}
