package com.matrimony.repository

import com.matrimony.model.Interest
import com.matrimony.model.InterestStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface InterestRepository : JpaRepository<Interest, Long> {
    fun findBySenderIdAndReceiverId(senderId: Long, receiverId: Long): Interest?
    fun findBySenderId(senderId: Long): List<Interest>
    fun findByReceiverId(receiverId: Long): List<Interest>
    fun findByReceiverIdAndStatus(receiverId: Long, status: InterestStatus): List<Interest>
    fun countBySenderIdAndStatus(senderId: Long, status: InterestStatus): Long
}
