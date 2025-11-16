// REST Controller for Spring Service
// Demonstrates basic REST endpoints for health checks and API information

package com.civ2025.springservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    // Health check endpoint - useful for load balancers and monitoring
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "spring-service");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }

    // Root endpoint
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to CIV2025 Spring Service");
        response.put("endpoints", new String[]{"/health", "/api/info"});
        response.put("version", "1.0.0");
        return response;
    }

    // API info endpoint
    @GetMapping("/api/info")
    public Map<String, Object> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "spring-service");
        response.put("description", "Template microservice for CI/CD learning");
        response.put("language", "Java");
        response.put("framework", "Spring Boot");
        response.put("port", System.getProperty("server.port", "8080"));
        return response;
    }
}