package com.matrimony.controller

import com.matrimony.dto.*
import com.matrimony.security.UserDetailsImpl
import com.matrimony.service.ProfileService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profiles")
class ProfileController(private val profileService: ProfileService) {

    @PostMapping
    fun createProfile(
        @AuthenticationPrincipal user: UserDetailsImpl,
        @Valid @RequestBody request: CreateProfileRequest
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(profileService.createProfile(user.id, request))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/me")
    fun getMyProfile(
        @AuthenticationPrincipal user: UserDetailsImpl
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(profileService.getMyProfile(user.id))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/{id}")
    fun getProfile(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(profileService.getProfile(id))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/search")
    fun searchProfiles(@RequestBody request: SearchRequest): ResponseEntity<PagedProfileResponse> {
        return ResponseEntity.ok(profileService.searchProfiles(request))
    }

    @GetMapping("/search")
    fun searchProfilesGet(
        @RequestParam(required = false) gender: String?,
        @RequestParam(defaultValue = "18") minAge: Int,
        @RequestParam(defaultValue = "60") maxAge: Int,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "12") size: Int
    ): ResponseEntity<PagedProfileResponse> {
        val request = SearchRequest(
            gender = gender?.let { com.matrimony.model.Gender.valueOf(it) },
            minAge = minAge,
            maxAge = maxAge,
            page = page,
            size = size
        )
        return ResponseEntity.ok(profileService.searchProfiles(request))
    }
}
