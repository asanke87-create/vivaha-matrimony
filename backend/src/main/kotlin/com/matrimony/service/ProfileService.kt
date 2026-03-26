package com.matrimony.service

import com.matrimony.dto.*
import com.matrimony.model.*
import com.matrimony.repository.ProfileRepository
import com.matrimony.repository.UserRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.Period
import java.util.UUID

@Service
class ProfileService(
    private val profileRepository: ProfileRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun createProfile(userId: Long, request: CreateProfileRequest): ProfileResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found") }

        if (profileRepository.findByUserId(userId).isPresent)
            throw IllegalArgumentException("Profile already exists for this user")

        val adId = "AD-${UUID.randomUUID().toString().take(8).uppercase()}"

        val profile = Profile(
            user = user,
            adId = adId,
            firstName = request.firstName,
            lastName = request.lastName,
            gender = request.gender,
            dateOfBirth = request.dateOfBirth,
            religion = request.religion,
            ethnicity = request.ethnicity,
            civilStatus = request.civilStatus,
            height = request.height,
            country = request.country,
            district = request.district,
            city = request.city,
            education = request.education,
            profession = request.profession,
            employedIn = request.employedIn,
            annualIncome = request.annualIncome,
            aboutMe = request.aboutMe,
            partnerExpectations = request.partnerExpectations,
            fatherOccupation = request.fatherOccupation,
            motherOccupation = request.motherOccupation,
            siblings = request.siblings
        )
        val saved = profileRepository.save(profile)
        return toResponse(saved)
    }

    fun getProfile(id: Long): ProfileResponse {
        val profile = profileRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Profile not found") }
        return toResponse(profile)
    }

    fun getMyProfile(userId: Long): ProfileResponse {
        val profile = profileRepository.findByUserId(userId)
            .orElseThrow { IllegalArgumentException("Profile not found") }
        return toResponse(profile)
    }

    fun searchProfiles(request: SearchRequest): PagedProfileResponse {
        val pageable = PageRequest.of(request.page, request.size, Sort.by("createdAt").descending())
        val page = profileRepository.searchProfiles(
            gender = request.gender,
            religion = request.religion,
            ethnicity = request.ethnicity,
            country = request.country,
            minAge = request.minAge,
            maxAge = request.maxAge,
            pageable = pageable
        )
        return PagedProfileResponse(
            profiles = page.content.map { toResponse(it) },
            totalElements = page.totalElements,
            totalPages = page.totalPages,
            currentPage = page.number
        )
    }

    private fun toResponse(profile: Profile): ProfileResponse {
        val age = Period.between(profile.dateOfBirth, LocalDate.now()).years
        return ProfileResponse(
            id = profile.id,
            adId = profile.adId,
            firstName = profile.firstName,
            lastName = profile.lastName,
            gender = profile.gender,
            age = age,
            religion = profile.religion,
            ethnicity = profile.ethnicity,
            civilStatus = profile.civilStatus,
            height = profile.height,
            country = profile.country,
            district = profile.district,
            city = profile.city,
            education = profile.education,
            profession = profile.profession,
            employedIn = profile.employedIn,
            annualIncome = profile.annualIncome,
            aboutMe = profile.aboutMe,
            partnerExpectations = profile.partnerExpectations,
            fatherOccupation = profile.fatherOccupation,
            motherOccupation = profile.motherOccupation,
            siblings = profile.siblings,
            isVerified = profile.isVerified,
            photoUrl = profile.photoUrl,
            createdAt = profile.createdAt.toString()
        )
    }
}
