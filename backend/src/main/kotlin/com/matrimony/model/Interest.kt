package com.matrimony.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "interests")
data class Interest(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    val sender: Profile = Profile(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    val receiver: Profile = Profile(),

    @Enumerated(EnumType.STRING)
    var status: InterestStatus = InterestStatus.PENDING,

    val sentAt: LocalDateTime = LocalDateTime.now(),
    var respondedAt: LocalDateTime? = null
)

enum class InterestStatus { PENDING, ACCEPTED, DECLINED }
