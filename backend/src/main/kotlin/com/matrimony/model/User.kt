package com.matrimony.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val email: String = "",

    @Column(nullable = false)
    var password: String = "",

    @Column(unique = true)
    val phone: String = "",

    @Enumerated(EnumType.STRING)
    val role: Role = Role.USER,

    var isActive: Boolean = true,
    var isVerified: Boolean = false,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var profile: Profile? = null
)

enum class Role { USER, ADMIN }
