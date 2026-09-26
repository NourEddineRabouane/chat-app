package com.example.chat_app.auth;

import com.example.chat_app.user.User; // Your JPA Entity
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class MyUserDetails implements UserDetails {

    private final User user;

    public MyUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Assuming your User entity has a 'roles' or 'authorities' collection.
        // For example, if it has a 'role' string field:
        // return Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));

        // Or, if it has a collection of roles:
        // return user.getRoles().stream()
        //         .map(role -> new SimpleGrantedAuthority(role.getName()))
        //         .collect(Collectors.toList());

        // For a simple chat app, you might just have a 'USER' role for everyone
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Your field name
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Implement logic if you track account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Implement logic if you track account locking
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Implement logic if you track credential expiration
    }

    @Override
    public boolean isEnabled() {
        return true; // Implement logic if you track user enabled/disabled status
    }

    // Optional: Expose the underlying User entity if you need it in your controllers
     public User getUser() {
         return user;
     }
}