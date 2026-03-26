package com.matrimony.model

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "profiles")
data class Profile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User = User(),

    val adId: String = "",

    // Personal Info
    val firstName: String = "",
    val lastName: String = "",

    @Enumerated(EnumType.STRING)
    val gender: Gender = Gender.MALE,

    val dateOfBirth: LocalDate = LocalDate.now(),

    @Enumerated(EnumType.STRING)
    val religion: Religion = Religion.BUDDHIST,

    @Enumerated(EnumType.STRING)
    val ethnicity: Ethnicity = Ethnicity.SINHALESE,

    @Enumerated(EnumType.STRING)
    val civilStatus: CivilStatus = CivilStatus.NEVER_MARRIED,

    val height: Int = 0, // in cm

    // Location
    val country: String = "Sri Lanka",
    val district: String = "",
    val city: String = "",

    // Education & Career
    val education: String = "",
    val profession: String = "",
    val employedIn: String = "",
    val annualIncome: String = "",

    // About
    @Column(columnDefinition = "TEXT")
    val aboutMe: String = "",

    @Column(columnDefinition = "TEXT")
    val partnerExpectations: String = "",

    // Family
    val fatherOccupation: String = "",
    val motherOccupation: String = "",
    val siblings: Int = 0,

    // Preferences
    val isHidden: Boolean = false,
    val isVerified: Boolean = false,
    val photoUrl: String = "",

    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class Gender { MALE, FEMALE }
enum class Religion { BUDDHIST, HINDU, CHRISTIAN, CATHOLIC, ISLAM, OTHER }
enum class Ethnicity { SINHALESE, TAMIL, MUSLIM, BURGHER, OTHER }
enum class CivilStatus { NEVER_MARRIED, DIVORCED, WIDOWED, SEPARATED }
