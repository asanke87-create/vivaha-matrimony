package com.matrimony.repository

import com.matrimony.model.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface ProfileRepository : JpaRepository<Profile, Long> {
    fun findByUserId(userId: Long): Optional<Profile>
    fun findByAdId(adId: String): Optional<Profile>

    @Query("""
        SELECT p FROM Profile p 
        WHERE p.isHidden = false
        AND (:gender IS NULL OR p.gender = :gender)
        AND (:religion IS NULL OR p.religion = :religion)
        AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
        AND (:country IS NULL OR p.country = :country)
        AND (YEAR(CURRENT_DATE) - YEAR(p.dateOfBirth) BETWEEN :minAge AND :maxAge)
    """)
    fun searchProfiles(
        @Param("gender") gender: Gender?,
        @Param("religion") religion: Religion?,
        @Param("ethnicity") ethnicity: Ethnicity?,
        @Param("country") country: String?,
        @Param("minAge") minAge: Int,
        @Param("maxAge") maxAge: Int,
        pageable: Pageable
    ): Page<Profile>
}
