package com.fitness.user_service.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;
@JsonPropertyOrder({
        "id",
        "email",
        "keycloakId",
        "password",
        "firstName",
        "lastName",
        "createdAt",
        "updatedAt"
})
@Data
public class UserResponse {
    private String id;
    private String keycloakId;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
