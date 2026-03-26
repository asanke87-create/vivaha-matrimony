package com.matrimony.config

import com.matrimony.model.*
import com.matrimony.repository.ProfileRepository
import com.matrimony.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class DataSeeder(
    private val userRepository: UserRepository,
    private val profileRepository: ProfileRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        val sampleData = listOf(
            Triple("nimal@email.com", Gender.MALE, "Nimal"),
            Triple("kumari@email.com", Gender.FEMALE, "Kumari"),
            Triple("sunil@email.com", Gender.MALE, "Sunil"),
            Triple("priya@email.com", Gender.FEMALE, "Priya"),
            Triple("rohan@email.com", Gender.MALE, "Rohan"),
            Triple("sandya@email.com", Gender.FEMALE, "Sandya"),
        )

        val lastNames = listOf("Silva", "Perera", "Fernando", "Jayasuriya", "Wickramasinghe", "Bandara")
        val professions = listOf("Engineer", "Doctor", "Teacher", "IT Professional", "Accountant", "Lawyer")
        val educations = listOf("Bachelor's Degree", "Master's Degree", "Diploma", "PhD")
        val religions = listOf(Religion.BUDDHIST, Religion.HINDU, Religion.CHRISTIAN, Religion.CATHOLIC)
        val ethnicities = listOf(Ethnicity.SINHALESE, Ethnicity.TAMIL, Ethnicity.MUSLIM)

        sampleData.forEachIndexed { index, (email, gender, firstName) ->
            if (!userRepository.existsByEmail(email)) {
                val user = userRepository.save(
                    User(
                        email = email,
                        password = passwordEncoder.encode("password123"),
                        phone = "+94771234${500 + index}",
                        isVerified = true
                    )
                )
                val dob = LocalDate.now().minusYears((24 + index * 2).toLong())
                profileRepository.save(
                    Profile(
                        user = user,
                        adId = "AD-SEED${1000 + index}",
                        firstName = firstName,
                        lastName = lastNames[index],
                        gender = gender,
                        dateOfBirth = dob,
                        religion = religions[index % religions.size],
                        ethnicity = ethnicities[index % ethnicities.size],
                        civilStatus = CivilStatus.NEVER_MARRIED,
                        height = if (gender == Gender.MALE) 170 + index else 155 + index,
                        country = "Sri Lanka",
                        district = "Colombo",
                        city = "Colombo",
                        education = educations[index % educations.size],
                        profession = professions[index],
                        employedIn = "Private Sector",
                        annualIncome = "LKR 1,000,000 - 2,000,000",
                        aboutMe = "I am a sincere, family-oriented person looking for a life partner who shares similar values and dreams.",
                        partnerExpectations = "Looking for someone who is kind, educated and family-oriented.",
                        fatherOccupation = "Retired Government Officer",
                        motherOccupation = "Homemaker",
                        siblings = index % 3,
                        isVerified = index % 2 == 0
                    )
                )
            }
        }
    }
}
