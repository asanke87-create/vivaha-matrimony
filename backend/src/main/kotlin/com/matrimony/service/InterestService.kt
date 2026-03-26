package com.matrimony.service

import com.matrimony.model.Interest
import com.matrimony.model.InterestStatus
import com.matrimony.repository.InterestRepository
import com.matrimony.repository.ProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

data class InterestDto(
    val id: Long,
    val senderId: Long,
    val senderName: String,
    val receiverId: Long,
    val receiverName: String,
    val status: InterestStatus,
    val sentAt: String
)

@Service
class InterestService(
    private val interestRepository: InterestRepository,
    private val profileRepository: ProfileRepository
) {

    @Transactional
    fun sendInterest(senderUserId: Long, receiverProfileId: Long): InterestDto {
        val sender = profileRepository.findByUserId(senderUserId)
            .orElseThrow { IllegalArgumentException("Sender profile not found") }
        val receiver = profileRepository.findById(receiverProfileId)
            .orElseThrow { IllegalArgumentException("Receiver profile not found") }

        if (sender.id == receiver.id)
            throw IllegalArgumentException("Cannot send interest to yourself")

        val existing = interestRepository.findBySenderIdAndReceiverId(sender.id, receiver.id)
        if (existing != null)
            throw IllegalArgumentException("Interest already sent")

        val interest = interestRepository.save(Interest(sender = sender, receiver = receiver))
        return toDto(interest)
    }

    @Transactional
    fun respondToInterest(interestId: Long, userId: Long, accept: Boolean): InterestDto {
        val interest = interestRepository.findById(interestId)
            .orElseThrow { IllegalArgumentException("Interest not found") }

        val receiver = profileRepository.findByUserId(userId)
            .orElseThrow { IllegalArgumentException("Profile not found") }

        if (interest.receiver.id != receiver.id)
            throw IllegalArgumentException("Not authorized to respond")

        interest.status = if (accept) InterestStatus.ACCEPTED else InterestStatus.DECLINED
        interest.respondedAt = LocalDateTime.now()
        val updated = interestRepository.save(interest)
        return toDto(updated)
    }

    fun getSentInterests(userId: Long): List<InterestDto> {
        val profile = profileRepository.findByUserId(userId)
            .orElseThrow { IllegalArgumentException("Profile not found") }
        return interestRepository.findBySenderId(profile.id).map { toDto(it) }
    }

    fun getReceivedInterests(userId: Long): List<InterestDto> {
        val profile = profileRepository.findByUserId(userId)
            .orElseThrow { IllegalArgumentException("Profile not found") }
        return interestRepository.findByReceiverId(profile.id).map { toDto(it) }
    }

    private fun toDto(interest: Interest) = InterestDto(
        id = interest.id,
        senderId = interest.sender.id,
        senderName = "${interest.sender.firstName} ${interest.sender.lastName}",
        receiverId = interest.receiver.id,
        receiverName = "${interest.receiver.firstName} ${interest.receiver.lastName}",
        status = interest.status,
        sentAt = interest.sentAt.toString()
    )
}
