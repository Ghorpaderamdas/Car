package com.UberDragons.project.uber.UberApp.controllers;

import com.UberDragons.project.uber.UberApp.dto.*;
import com.UberDragons.project.uber.UberApp.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = true)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signUp(@RequestBody SignupDto signupDto) {
        return new ResponseEntity<>(authService.signup(signupDto), HttpStatus.CREATED);
    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/onBoardNewDriver/{userId}")
    public ResponseEntity<DriverDto> onBoardNewDriver(@PathVariable Long userId, @RequestBody OnboardDriverDto onboardDriverDto) {
        return new ResponseEntity<>(authService.onboardNewDriver(userId,
                onboardDriverDto.getVehicleId()), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto,
                                                  HttpServletRequest request, HttpServletResponse response) {
        try {
            System.out.println("🔐 Login attempt for: " + loginRequestDto.getEmail());

            String[] tokens = authService.login(loginRequestDto.getEmail(), loginRequestDto.getPassword());

            Cookie cookie = new Cookie("refreshToken", tokens[1]);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
            response.addCookie(cookie);

            return ResponseEntity.ok(new LoginResponseDto(tokens[0]));
        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDto("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refresh(HttpServletRequest request) {
        try {
            String refreshToken = Arrays.stream(request.getCookies() != null ? request.getCookies() : new Cookie[0])
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElseThrow(() -> new RuntimeException("Refresh token not found"));

            String accessToken = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(new LoginResponseDto(accessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponseDto("Refresh failed: " + e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUserByEmail(@RequestParam String email) {
        try {
            UserDto user = authService.findByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<Object> getUserRoles(@RequestParam String email) {
        try {
            UserDto user = authService.findByEmail(email);
            return ResponseEntity.ok(user.getRoles());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}