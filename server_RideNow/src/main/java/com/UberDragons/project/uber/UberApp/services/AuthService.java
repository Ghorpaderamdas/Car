package com.UberDragons.project.uber.UberApp.services;

import com.UberDragons.project.uber.UberApp.dto.DriverDto;
import com.UberDragons.project.uber.UberApp.dto.SignupDto;
import com.UberDragons.project.uber.UberApp.dto.UserDto;

public interface AuthService {
   abstract String[] login(String email, String password);
    abstract UserDto signup(SignupDto signupDto);
   abstract DriverDto onboardNewDriver(Long userId, String vehicleId);
    String refreshToken(String refreshToken);

    UserDto findByEmail(String email);

}
