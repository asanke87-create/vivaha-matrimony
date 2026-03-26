package com.matrimony.controller

import com.matrimony.security.UserDetailsImpl
import com.matrimony.service.InterestService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/interests")
class InterestController(private val interestService: InterestService) {

    @PostMapping("/send/{receiverProfileId}")
    fun sendInterest(
        @AuthenticationPrincipal user: UserDetailsImpl,
        @PathVariable receiverProfileId: Long
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(interestService.sendInterest(user.id, receiverProfileId))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @PutMapping("/{interestId}/respond")
    fun respondToInterest(
        @AuthenticationPrincipal user: UserDetailsImpl,
        @PathVariable interestId: Long,
        @RequestParam accept: Boolean
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(interestService.respondToInterest(interestId, user.id, accept))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/sent")
    fun getSentInterests(
        @AuthenticationPrincipal user: UserDetailsImpl
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(interestService.getSentInterests(user.id))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/received")
    fun getReceivedInterests(
        @AuthenticationPrincipal user: UserDetailsImpl
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(interestService.getReceivedInterests(user.id))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}
