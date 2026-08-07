package vn.edu.crs.auth_service.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if ("student".equals(username) && "123456".equals(password)) {
            return Map.of(
                    "status", "success",
                    "token", "mock-jwt-token-xyz123",
                    "username", username,
                    "role", "STUDENT"
            );
        }
        return Map.of("status", "error", "message", "Sai tai khoan hoac mat khau!");
    }
}