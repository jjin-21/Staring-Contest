package com.sixback.eyebird.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
@OpenAPIDefinition(info = @Info(title = "EyeBird", version = "v1", description = "Documentation of EyeBird"))
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("eyebird")
                .pathsToMatch("/api/**")
                .build();
    }
    @Bean
    public GroupedOpenApi publicApiRoom() {
        return GroupedOpenApi.builder()
                .group("eyebird-room")
                .pathsToMatch("/api/room/**")
                .build();
    }

    @Bean
    public GroupedOpenApi publicApiUser() {
        return GroupedOpenApi.builder()
                .group("eyebird-user")
                .pathsToMatch("/api/user/**")
                .build();
    }

    @Bean
    public GroupedOpenApi publicApiAuth() {
        return GroupedOpenApi.builder()
                .group("eyebird-auth")
                .pathsToMatch("/api/auth/**")
                .build();
    }

    @Bean
    public GroupedOpenApi publicApiPoint() {
        return GroupedOpenApi.builder()
                .group("eyebird-point")
                .pathsToMatch("/api/point/**")
                .build();
    }

    @Bean
    public GroupedOpenApi publicApiFriend() {
        return GroupedOpenApi.builder()
                .group("eyebird-friend")
                .pathsToMatch("/api/friend/**")
                .build();
    }

}
