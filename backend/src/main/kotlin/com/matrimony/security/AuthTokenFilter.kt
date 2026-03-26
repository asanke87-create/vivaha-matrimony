package com.matrimony.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class AuthTokenFilter(
    private val jwtUtils: JwtUtils,
    private val userDetailsService: UserDetailsServiceImpl
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt = parseJwt(request)
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            val username = jwtUtils.getUsernameFromJwtToken(jwt)
            val userDetails = userDetailsService.loadUserByUsername(username)
            val authentication = UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.authorities
            )
            authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
            SecurityContextHolder.getContext().authentication = authentication
        }
        filterChain.doFilter(request, response)
    }

    private fun parseJwt(request: HttpServletRequest): String? {
        val headerAuth = request.getHeader("Authorization") ?: return null
        return if (headerAuth.startsWith("Bearer ")) headerAuth.substring(7) else null
    }
}
