package com.example.chat_app.group;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, GroupMemberId> {

}