import React from 'react';
import { Link } from 'react-router-dom';
import { Profile } from '../types';
import styles from './ProfileCard.module.css';

const cmToFtIn = (cm: number) => {
  const totalIn = Math.round(cm / 2.54);
  return `${Math.floor(totalIn / 12)}.${totalIn % 12 < 10 ? '0' : ''}${totalIn % 12 < 1 ? '1' : totalIn % 12}cm`;
};

interface Props {
  profile: Profile;
  onInterest?: (id: number) => void;
  interestSent?: boolean;
}

const ProfileCard = ({ profile, onInterest, interestSent }: Props) => (
  <Link to={`/profile/${profile.id}`} className={styles.card}>
    {/* Avatar */}
    <div className={styles.avatarWrap}>
      {profile.photoUrl
        ? <img src={profile.photoUrl} alt={profile.firstName} className={styles.avatarImg} />
        : (
          <div className={styles.avatarPlaceholder}>
            <span>{profile.gender === 'MALE' ? '👔' : '👗'}</span>
          </div>
        )
      }
      {profile.isVerified && <span className={styles.verBadge}>✓</span>}
    </div>

    {/* Info */}
    <div className={styles.info}>
      <h3 className={styles.name}>{profile.firstName} {profile.lastName[0]}.</h3>
      <p className={styles.location}>📍 {profile.city || profile.district}, {profile.country}</p>

      <div className={styles.tags}>
        <span className={styles.tag}>
          <span className={styles.tagIcon}>👤</span>
          {profile.age} Years
        </span>
        <span className={styles.tag}>
          <span className={styles.tagIcon}>📏</span>
          {profile.height}.0cm
        </span>
        <span className={styles.tag}>
          <span className={styles.tagIcon}>💼</span>
          {profile.profession || 'Not specified'}
        </span>
        <span className={styles.tag}>
          <span className={styles.tagIcon}>🙏</span>
          {profile.religion.charAt(0) + profile.religion.slice(1).toLowerCase()}
        </span>
      </div>
    </div>

    {/* Interest button */}
    {onInterest && (
      <button
        className={`${styles.interestBtn} ${interestSent ? styles.sent : ''}`}
        onClick={e => { e.preventDefault(); !interestSent && onInterest(profile.id); }}
        title={interestSent ? 'Interest Sent' : 'Send Interest'}
      >
        {interestSent ? '✓' : '💌'}
      </button>
    )}
  </Link>
);

export default ProfileCard;
