import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { profileApi, interestApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Profile } from '../types';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'received' | 'sent'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, recRes, sentRes] = await Promise.allSettled([
          profileApi.getMe(),
          interestApi.getReceived(),
          interestApi.getSent(),
        ]);
        if (pRes.status === 'fulfilled') setProfile(pRes.value.data);
        if (recRes.status === 'fulfilled') setReceived(recRes.value.data);
        if (sentRes.status === 'fulfilled') setSent(sentRes.value.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleRespond = async (interestId: number, accept: boolean) => {
    try {
      await interestApi.respond(interestId, accept);
      const res = await interestApi.getReceived();
      setReceived(res.data);
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to respond');
    }
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  );

  if (!profile) return (
    <div className={styles.noProfile}>
      <span>📝</span>
      <h2>No Profile Found</h2>
      <p>Create your matrimony ad to start finding matches.</p>
      <Link to="/create-profile" className={styles.createBtn}>
        Create Your Ad Now
      </Link>
    </div>
  );

  const pendingReceived = received.filter(i => i.status === 'PENDING');
  const acceptedMatches = received.filter(i => i.status === 'ACCEPTED');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.welcome}>
            <h1>Welcome, {profile.firstName}! 👋</h1>
            <p>Ad ID: <strong>{profile.adId}</strong></p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/search" className={styles.btnPrimary}>
              🔍 Find Matches
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💌</div>
            <div className={styles.statValue}>{pendingReceived.length}</div>
            <div className={styles.statLabel}>Pending Interests</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💑</div>
            <div className={styles.statValue}>{acceptedMatches.length}</div>
            <div className={styles.statLabel}>Accepted Matches</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📤</div>
            <div className={styles.statValue}>{sent.length}</div>
            <div className={styles.statLabel}>Interests Sent</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>{profile.isVerified ? '✅' : '⏳'}</div>
            <div className={styles.statValue}>{profile.isVerified ? 'Verified' : 'Pending'}</div>
            <div className={styles.statLabel}>Profile Status</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(['overview', 'received', 'sent'] as const).map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' ? '👤 My Profile'
                : tab === 'received' ? `💌 Received (${received.length})`
                : `📤 Sent (${sent.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.profileView}>
              <div className={styles.profileCard}>
                <div className={styles.profileAvatar}>
                  <span>{profile.gender === 'MALE' ? '👨' : '👩'}</span>
                  {profile.isVerified && <span className={styles.verBadge}>✓</span>}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{profile.firstName} {profile.lastName}</h2>
                  <p>{profile.age} years · {profile.city}, {profile.country}</p>
                  <p>{profile.education} · {profile.profession}</p>
                </div>
              </div>
              <div className={styles.profileDetails}>
                {[
                  ['Religion', profile.religion],
                  ['Ethnicity', profile.ethnicity],
                  ['Civil Status', profile.civilStatus.replace('_', ' ')],
                  ['Employment', profile.employedIn],
                  ['Annual Income', profile.annualIncome],
                  ['Siblings', String(profile.siblings)],
                ].map(([k, v]) => (
                  <div key={k} className={styles.detailRow}>
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              {profile.aboutMe && (
                <div className={styles.aboutSection}>
                  <h4>About Me</h4>
                  <p>{profile.aboutMe}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'received' && (
            <div className={styles.interestsList}>
              {received.length === 0 ? (
                <div className={styles.empty}>
                  <span>💌</span>
                  <p>No interests received yet. Keep your profile active!</p>
                </div>
              ) : received.map((interest: any) => (
                <div key={interest.id} className={styles.interestCard}>
                  <div className={styles.interestInfo}>
                    <strong>{interest.senderName}</strong>
                    <span className={`${styles.badge} ${styles[interest.status.toLowerCase()]}`}>
                      {interest.status}
                    </span>
                  </div>
                  <div className={styles.interestMeta}>
                    <span>Received {new Date(interest.sentAt).toLocaleDateString()}</span>
                    <Link to={`/profile/${interest.senderId}`} className={styles.viewLink}>
                      View Profile →
                    </Link>
                  </div>
                  {interest.status === 'PENDING' && (
                    <div className={styles.interestActions}>
                      <button
                        className={styles.acceptBtn}
                        onClick={() => handleRespond(interest.id, true)}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className={styles.declineBtn}
                        onClick={() => handleRespond(interest.id, false)}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className={styles.interestsList}>
              {sent.length === 0 ? (
                <div className={styles.empty}>
                  <span>💔</span>
                  <p>You haven't sent any interests yet. <Link to="/search">Browse matches</Link></p>
                </div>
              ) : sent.map((interest: any) => (
                <div key={interest.id} className={styles.interestCard}>
                  <div className={styles.interestInfo}>
                    <strong>{interest.receiverName}</strong>
                    <span className={`${styles.badge} ${styles[interest.status.toLowerCase()]}`}>
                      {interest.status}
                    </span>
                  </div>
                  <div className={styles.interestMeta}>
                    <span>Sent {new Date(interest.sentAt).toLocaleDateString()}</span>
                    <Link to={`/profile/${interest.receiverId}`} className={styles.viewLink}>
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
