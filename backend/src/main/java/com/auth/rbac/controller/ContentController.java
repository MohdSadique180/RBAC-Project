package com.auth.rbac.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Tag(name = "Content", description = "Role-based content endpoints")
public class ContentController {

    @GetMapping("/api/public")
    @Operation(summary = "Public endpoint — no auth required")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        return ResponseEntity.ok(Map.of(
            "message", "This is public content accessible to everyone.",
            "access", "PUBLIC"
        ));
    }

    @GetMapping("/api/user")
    @Operation(
        summary = "User endpoint — requires USER or ADMIN role",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Map<String, String>> userEndpoint(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(Map.of(
            "message", "Welcome, " + userDetails.getUsername() + "! This is user-level content.",
            "access", "USER"
        ));
    }

    @GetMapping("/api/admin")
    @Operation(
        summary = "Admin endpoint — requires ADMIN role only",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<Map<String, String>> adminEndpoint(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(Map.of(
            "message", "Hello Admin " + userDetails.getUsername() + "! You have full access.",
            "access", "ADMIN"
        ));
    }
}
