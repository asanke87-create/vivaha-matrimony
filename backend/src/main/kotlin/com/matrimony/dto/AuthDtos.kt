package com.matrimony.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:Email(message = "Invalid email address")
    @field:NotBlank(message = "Email is required")
    val email: String = "",

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 8, message = "Password must be at least 8 characters")
    val password: String = "",

    @field:NotBlank(message = "Phone is required")
    val phone: String = ""
)

data class LoginRequest(
    @field:Email
    @field:NotBlank
    val email: String = "",

    @field:NotBlank
    val password: String = ""
)

data class AuthResponse(
    val token: String,
    val type: String = "Bearer",
    val userId: Long,
    val email: String,
    val hasProfile: Boolean
)

data class MessageResponse(val message: String)
