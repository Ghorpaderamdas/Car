package com.UberDragons.project.uber.UberApp.controllers;

import com.UberDragons.project.uber.UberApp.advices.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {
    @GetMapping("/hello")
    public ResponseEntity<ApiResponse<String>> sayHello() {
        ApiResponse<String> response = new ApiResponse<>("Hello from backend");
        return ResponseEntity.ok(response);
    }


}

