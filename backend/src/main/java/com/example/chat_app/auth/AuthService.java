package com.example.chat_app.auth;

import com.example.chat_app.auth.dto.LoginDTO;
import com.example.chat_app.auth.dto.SignUpDTO;
import com.example.chat_app.auth.dto.UserDTO;
import com.example.chat_app.auth.mapper.ModelMapper;
import com.example.chat_app.user.User;
import com.example.chat_app.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    //---------------------------SignUp------------------------
    public UserDTO signUp(SignUpDTO signUpDTO) {
        userRepository.findByEmail(signUpDTO.getEmail())
                .ifPresent(u -> { throw new BadCredentialsException("Email already exists"); });

        User toBeCreatedUser = modelMapper.mapSignupDtoTouser(signUpDTO);
        toBeCreatedUser.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));

        User savedUser = userRepository.save(toBeCreatedUser);
        return modelMapper.mapUsertoUserdto(savedUser);
    }

    //---------------------------Login------------------------
    public String login(LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                );

        Authentication authentication = authenticationManager.authenticate(token);
        MyUserDetails myUserDetails = (MyUserDetails) authentication.getPrincipal();


        User user = myUserDetails.getUser();

        return jwtService.generateAccessToken(user);
    }
}