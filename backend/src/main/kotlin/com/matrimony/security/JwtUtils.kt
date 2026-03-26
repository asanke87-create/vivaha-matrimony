package com.matrimony.security

import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtUtils {

    @Value("\${app.jwt.secret}")
    private lateinit var jwtSecret: String

    @Value("\${app.jwt.expiration-ms}")
    private var jwtExpirationMs: Int = 0

    private fun getSigningKey(): SecretKey =
        Keys.hmacShaKeyFor(jwtSecret.toByteArray())

    fun generateJwtToken(authentication: Authentication): String {
        val userPrincipal = authentication.principal as UserDetailsImpl
        return Jwts.builder()
            .subject(userPrincipal.username)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(getSigningKey())
            .compact()
    }

    fun getUsernameFromJwtToken(token: String): String =
        Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .payload
            .subject

    fun validateJwtToken(authToken: String): Boolean {
        return try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken)
            true
        } catch (e: Exception) {
            false
        }
    }
}
