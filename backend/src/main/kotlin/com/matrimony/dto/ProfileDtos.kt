package com.matrimony.dto

import com.matrimony.model.*
import jakarta.validation.constraints.NotBlank
import java.time.LocalDate

data class CreateProfileRequest(
    @field:NotBlank val firstName: String = "",
    @field:NotBlank val lastName: String = "",
    val gender: Gender = Gender.MALE,
    val dateOfBirth: LocalDate = LocalDate.now(),
    val religion: Religion = Religion.BUDDHIST,
    val ethnicity: Ethnicity = Ethnicity.SINHALESE,
    val civilStatus: CivilStatus = CivilStatus.NEVER_MARRIED,
    val height: Int = 160,
    val country: String = "Sri Lanka",
    val district: String = "",
    val city: String = "",
    val education: String = "",
    val profession: String = "",
    val employedIn: String = "",
    val annualIncome: String = "",
    val aboutMe: String = "",
    val partnerExpectations: String = "",
    val fatherOccupation: String = "",
    val motherOccupation: String = "",
    val siblings: Int = 0
)

data class ProfileResponse(
    val id: Long,
    val adId: String,
    val firstName: String,
    val lastName: String,
    val gender: Gender,
    val age: Int,
    val religion: Religion,
    val ethnicity: Ethnicity,
    val civilStatus: CivilStatus,
    val height: Int,
    val country: String,
    val district: String,
    val city: String,
    val education: String,
    val profession: String,
    val employedIn: String,
    val annualIncome: String,
    val aboutMe: String,
    val partnerExpectations: String,
    val fatherOccupation: String,
    val motherOccupation: String,
    val siblings: Int,
    val isVerified: Boolean,
    val photoUrl: String,
    val createdAt: String
)

data class SearchRequest(
    val gender: Gender? = null,
    val minAge: Int = 18,
    val maxAge: Int = 60,
    val religion: Religion? = null,
    val ethnicity: Ethnicity? = null,
    val country: String? = null,
    val page: Int = 0,
    val size: Int = 12
)

data class PagedProfileResponse(
    val profiles: List<ProfileResponse>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int
)
