package com.matrimony.controller

import com.matrimony.dto.*
import com.matrimony.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<MessageResponse> {
        return try {
            ResponseEntity.ok(authService.register(request))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(MessageResponse(e.message ?: "Registration failed"))
        }
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(authService.login(request))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(MessageResponse("Invalid email or password"))
        }
    }
}
