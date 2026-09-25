package com.example.chat_app.group;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_group_member")
@IdClass(GroupMember.class)
public class GroupMember {
    @Id private Long groupId;
    @Id private  Long userId;

    @Enumerated(EnumType.STRING)
    private MemberRole role;

    private LocalDateTime joinedAt;

}

class  GroupMemberId implements Serializable {
    private Long groupId;
    private Long userId;
}

