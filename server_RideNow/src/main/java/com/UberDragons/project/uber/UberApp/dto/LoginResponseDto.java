package com.UberDragons.project.uber.UberApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String accessToken;
    private String refreshToken;
    private UserDto user;

    public LoginResponseDto(String accessToken) {
        this.accessToken = accessToken;
    }
}