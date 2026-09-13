package com.fitness.user_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    public String email;

    @NotBlank(message = "Password is Required")
    @Size(min = 6, message = "Password should be at least 6 characters")
    public String password;

    private String keycloakId;

    public String firstName;
    public String lastName;
}
