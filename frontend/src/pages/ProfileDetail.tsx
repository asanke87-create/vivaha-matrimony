import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileApi, interestApi } from '../services/api';
import { Profile } from '../types';
import { useAuth } from '../context/AuthContext';
import styles from './ProfileDetail.module.css';

const heightLabel = (cm: number) => {
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${ft}'${inches}" (${cm} cm)`;
};

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [interestSent, setInterestSent] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    profileApi.getById(+id)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInterest = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setInterestLoading(true);
    try {
      await interestApi.send(profile!.id);
      setInterestSent(true);
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Could not send interest');
    }
    setInterestLoading(false);
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Loading profile...</p>
    </div>
  );

  if (!profile) return (
    <div className={styles.notFound}>
      <span>😔</span>
      <h2>Profile not found</h2>
      <button onClick={() => navigate('/search')} className={styles.backBtn}>
        Back to Search
      </button>
    </div>
  );

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
    <div className={styles.infoRow}>
      <span className={styles.infoIcon}>{icon}</span>
      <div>
        <div className={styles.infoLabel}>{label}</div>
        <div className={styles.infoValue}>{value || 'Not specified'}</div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className={styles.layout}>
          {/* Left Panel */}
          <div className={styles.leftPanel}>
            <div className={styles.avatarCard}>
              <div className={styles.avatar}>
                {profile.photoUrl
                  ? <img src={profile.photoUrl} alt={profile.firstName} />
                  : <span>{profile.gender === 'MALE' ? '👨' : '👩'}</span>
                }
                {profile.isVerified && (
                  <div className={styles.verifiedBadge}>✓ Verified</div>
                )}
              </div>
              <h2 className={styles.name}>
                {profile.firstName} {isAuthenticated ? profile.lastName : profile.lastName[0] + '.'}
              </h2>
              <p className={styles.adId}>{profile.adId}</p>
              <p className={styles.subInfo}>
                {profile.age} yrs · {heightLabel(profile.height)}
              </p>
              <p className={styles.subInfo}>
                📍 {profile.city}, {profile.country}
              </p>

              {!isAuthenticated ? (
                <div className={styles.loginPrompt}>
                  <p>Login to see full details and send interest</p>
                  <button onClick={() => navigate('/login')} className={styles.loginBtn}>
                    Sign In to Connect
                  </button>
                </div>
              ) : (
                <button
                  className={`${styles.interestBtn} ${interestSent ? styles.interestSent : ''}`}
                  onClick={handleInterest}
                  disabled={interestSent || interestLoading}
                >
                  {interestLoading ? '...' : interestSent ? '✓ Interest Sent' : '💌 Send Interest'}
                </button>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className={styles.rightPanel}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>👤 Personal Details</h3>
              <div className={styles.infoGrid}>
                <InfoRow icon="🙏" label="Religion" value={profile.religion} />
                <InfoRow icon="🌍" label="Ethnicity" value={profile.ethnicity} />
                <InfoRow icon="💍" label="Civil Status" value={profile.civilStatus.replace('_', ' ')} />
                <InfoRow icon="📅" label="Age" value={`${profile.age} years`} />
                <InfoRow icon="📏" label="Height" value={heightLabel(profile.height)} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>🎓 Education & Career</h3>
              <div className={styles.infoGrid}>
                <InfoRow icon="📚" label="Education" value={profile.education} />
                <InfoRow icon="💼" label="Profession" value={profile.profession} />
                <InfoRow icon="🏢" label="Employed In" value={profile.employedIn} />
                <InfoRow icon="💰" label="Annual Income" value={profile.annualIncome} />
              </div>
            </section>

            {profile.aboutMe && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>💬 About Me</h3>
                <p className={styles.aboutText}>{profile.aboutMe}</p>
              </section>
            )}

            {profile.partnerExpectations && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>❤️ Partner Expectations</h3>
                <p className={styles.aboutText}>{profile.partnerExpectations}</p>
              </section>
            )}

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>👨‍👩‍👧 Family Details</h3>
              <div className={styles.infoGrid}>
                <InfoRow icon="👨" label="Father's Occupation" value={profile.fatherOccupation} />
                <InfoRow icon="👩" label="Mother's Occupation" value={profile.motherOccupation} />
                <InfoRow icon="👫" label="Siblings" value={`${profile.siblings} sibling(s)`} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
