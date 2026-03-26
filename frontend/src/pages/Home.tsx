import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../services/api';
import { Profile } from '../types';
import ProfileCard from '../components/ProfileCard';
import styles from './Home.module.css';

const AGES = Array.from({ length: 43 }, (_, i) => i + 18);

const FEATURES = [
  { icon: '🔒', title: 'Privacy & Security', desc: 'Your personal details are protected. Photos and contact info are only shared with connections you approve.' },
  { icon: '✅', title: 'Genuine Accounts', desc: 'Every member is a paid verified account — serious about finding a life partner.' },
  { icon: '📞', title: '7-Day Support', desc: 'Our dedicated support team is available 7 days a week from 8:30 am to 8:30 pm.' },
  { icon: '💌', title: 'Unlimited Interests', desc: 'Connect with as many compatible matches as you like with no restrictions.' },
];

const REVIEWS = [
  { name: 'Sandapani G', text: 'Very good efficient service. Agents are providing kind service. Highly recommend!', rating: 5, date: 'Dec 2025' },
  { name: 'Nilani W', text: 'I found the best matching partner through Vivaha.lk. Highly recommended!', rating: 5, date: 'May 2025' },
  { name: 'Malki K', text: 'Great experience! Easy to navigate with great emphasis on privacy and security.', rating: 5, date: 'Apr 2025' },
];

const CATEGORIES = [
  { label: 'Female Doctors', icon: '👩‍⚕️', count: '1,240+', gradient: 'linear-gradient(135deg,#fce4ec,#f8bbd0)' },
  { label: 'Male Engineers', icon: '👨‍💻', count: '3,100+', gradient: 'linear-gradient(135deg,#e3f2fd,#bbdefb)' },
  { label: 'Overseas Grooms', icon: '✈️', count: '890+',   gradient: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)' },
  { label: 'Brides in Sri Lanka', icon: '🌸', count: '8,500+', gradient: 'linear-gradient(135deg,#fff8e1,#ffecb3)' },
  { label: 'Buddhist Matches', icon: '🙏', count: '12,000+', gradient: 'linear-gradient(135deg,#ede7f6,#d1c4e9)' },
  { label: 'Verified Profiles', icon: '✅', count: '30,000+', gradient: 'linear-gradient(135deg,#e0f7fa,#b2ebf2)' },
];

const Home = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState('FEMALE');
  const [minAge, setMinAge] = useState(22);
  const [maxAge, setMaxAge] = useState(32);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    profileApi.search({ page: 0, size: 8, minAge: 18, maxAge: 60 })
      .then(res => setProfiles(res.data.profiles || []))
      .catch(() => {});
  }, []);

  const handleSearch = () =>
    navigate(`/search?gender=${gender}&minAge=${minAge}&maxAge=${maxAge}`);

  return (
    <div className={styles.page}>

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        {/* Warm golden overlay over a wedding-scene gradient */}
        <div className={styles.heroImg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find Your Perfect<br />Life Partner</h1>
          <p className={styles.heroSub}>Sri Lanka's most trusted matrimony service — privacy-focused, culturally respectful.</p>

          {/* Pill search bar */}
          <div className={styles.searchPill}>
            <div className={styles.pillSection}>
              <span className={styles.pillLabel}>Bride or Groom ?</span>
              <div className={styles.genderBtns}>
                <button
                  className={`${styles.gBtn} ${gender === 'FEMALE' ? styles.gActive : ''}`}
                  onClick={() => setGender('FEMALE')}
                >👰 Bride</button>
                <button
                  className={`${styles.gBtn} ${gender === 'MALE' ? styles.gActive : ''}`}
                  onClick={() => setGender('MALE')}
                >🤵 Groom</button>
              </div>
            </div>

            <div className={styles.pillDivider} />

            <div className={styles.pillSection}>
              <span className={styles.pillLabel}>Age ?</span>
              <div className={styles.ageSelects}>
                <select value={minAge} onChange={e => setMinAge(+e.target.value)} className={styles.ageSelect}>
                  {AGES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <span className={styles.ageTo}>to</span>
                <select value={maxAge} onChange={e => setMaxAge(+e.target.value)} className={styles.ageSelect}>
                  {AGES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <button className={styles.searchBtn} onClick={handleSearch}>🔍</button>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div className={styles.statsBar}>
        {[
          ['50,000+', 'Registered Members'],
          ['12,000+', 'Successful Matches'],
          ['200+', 'New Ads Daily'],
          ['30,000+', 'Verified Profiles'],
        ].map(([v, l]) => (
          <div key={l} className={styles.stat}>
            <strong>{v}</strong><span>{l}</span>
          </div>
        ))}
      </div>

      {/* ─── TOP LIVE PROFILES ─── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <h2>Top Live Profiles</h2>
              <p className={styles.sectionSub}>Genuine members looking for their perfect match</p>
            </div>
            <button className={styles.viewAll} onClick={() => navigate('/search')}>View All →</button>
          </div>

          {profiles.length === 0 ? (
            <div className={styles.noProfiles}>
              <div className={styles.noProfilesInner}>
                <div className={styles.demoAvatars}>
                  {['👩','👨','👩','👨','👩','👨'].map((a,i) => (
                    <div key={i} className={styles.demoAvatar} style={{ zIndex: 6-i, marginLeft: i === 0 ? 0 : '-14px' }}>
                      {a}
                    </div>
                  ))}
                </div>
                <div className={styles.noProfilesText}>
                  <h3>50,000+ members waiting to connect</h3>
                  <p>Start the backend server to see live profiles, or browse to explore.</p>
                </div>
                <button onClick={() => navigate('/search')} className={styles.browseBtnSm}>
                  🔍 Browse Matches
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.profileGrid}>
              {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className={styles.catSection}>
        <div className={styles.sectionInner}>
          <div className={styles.catHeader}>
            <h2 className={styles.catTitle}>Top Categories</h2>
            <p className={styles.catSub}>Browse profiles by profession, religion and more</p>
          </div>
          <div className={styles.catGrid}>
            {CATEGORIES.map(c => (
              <button
                key={c.label}
                className={styles.catBtn}
                style={{ '--cat-bg': c.gradient } as React.CSSProperties}
                onClick={() => navigate('/search')}
              >
                <div className={styles.catIconWrap}>
                  <span className={styles.catIcon}>{c.icon}</span>
                </div>
                <span className={styles.catLabel}>{c.label}</span>
                <span className={styles.catCount}>{c.count} profiles</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>Why Choose Vivaha.lk?</h2>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className={styles.reviewSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>Trusted by Thousands</h2>
          </div>
          <div className={styles.reviewGrid}>
            {REVIEWS.map(r => (
              <div key={r.name} className={styles.reviewCard}>
                <div className={styles.reviewStars}>{'★'.repeat(r.rating)}</div>
                <p>"{r.text}"</p>
                <div className={styles.reviewMeta}>
                  <strong>{r.name}</strong><span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.cta}>
        <h2>Start Your Journey Today</h2>
        <p>Join thousands of Sri Lankans who found their life partner on Vivaha.lk</p>
        <div className={styles.ctaBtns}>
          <button onClick={() => navigate('/register')} className={styles.ctaGold}>Create Free Ad</button>
          <button onClick={() => navigate('/search')} className={styles.ctaOutline}>Browse Matches</button>
        </div>
      </section>

    </div>
  );
};

export default Home;
