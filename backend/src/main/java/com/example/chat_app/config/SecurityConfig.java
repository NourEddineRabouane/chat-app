package com.example.chat_app.config;

import com.example.chat_app.idgen.EurekaConfig;
import com.example.chat_app.idgen.SnowflakeIdGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {


    @Bean
    public SnowflakeIdGenerator snowflakeIdGenerator(EurekaConfig eurekaConfig){
        return new SnowflakeIdGenerator(eurekaConfig);
    }
}
