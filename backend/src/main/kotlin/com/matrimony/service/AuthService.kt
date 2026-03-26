package com.matrimony.service

import com.matrimony.dto.*
import com.matrimony.model.User
import com.matrimony.repository.UserRepository
import com.matrimony.repository.ProfileRepository
import com.matrimony.security.JwtUtils
import com.matrimony.security.UserDetailsImpl
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val profileRepository: ProfileRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtUtils: JwtUtils
) {

    fun register(request: RegisterRequest): MessageResponse {
        if (userRepository.existsByEmail(request.email))
            throw IllegalArgumentException("Email already registered")
        if (userRepository.existsByPhone(request.phone))
            throw IllegalArgumentException("Phone number already registered")

        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password),
            phone = request.phone
        )
        userRepository.save(user)
        return MessageResponse("Registration successful! Please create your profile.")
    }

    fun login(request: LoginRequest): AuthResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        SecurityContextHolder.getContext().authentication = authentication
        val jwt = jwtUtils.generateJwtToken(authentication)
        val userDetails = authentication.principal as UserDetailsImpl
        val hasProfile = profileRepository.findByUserId(userDetails.id).isPresent

        return AuthResponse(
            token = jwt,
            userId = userDetails.id,
            email = userDetails.username,
            hasProfile = hasProfile
        )
    }
}
