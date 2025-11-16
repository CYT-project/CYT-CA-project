// Main Spring Boot application class for CIV2025 template
// This demonstrates a basic Spring Boot microservice with REST endpoints

package com.civ2025.springservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringServiceApplication.class, args);
    }
}