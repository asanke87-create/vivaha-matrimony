import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { profileApi, interestApi } from '../services/api';
import { Profile } from '../types';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import styles from './Search.module.css';

const RELIGIONS = ['BUDDHIST', 'HINDU', 'CHRISTIAN', 'CATHOLIC', 'ISLAM', 'OTHER'];
const ETHNICITIES = ['SINHALESE', 'TAMIL', 'MUSLIM', 'BURGHER', 'OTHER'];

const Search = () => {
  const [params] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sentInterests, setSentInterests] = useState<Set<number>>(new Set());

  const [gender, setGender] = useState(params.get('gender') || '');
  const [minAge, setMinAge] = useState(+(params.get('minAge') || 18));
  const [maxAge, setMaxAge] = useState(+(params.get('maxAge') || 60));
  const [religion, setReligion] = useState('');
  const [ethnicity, setEthnicity] = useState('');

  const doSearch = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await profileApi.search({
        ...(gender ? { gender: gender as any } : {}),
        minAge,
        maxAge,
        ...(religion ? { religion } : {}),
        ...(ethnicity ? { ethnicity } : {}),
        page: p,
        size: 12,
      });
      setProfiles(res.data.profiles || []);
      setTotal(res.data.totalElements || 0);
      setTotalPages(res.data.totalPages || 0);
      setPage(p);
    } catch {
      setProfiles([]);
    }
    setLoading(false);
  }, [gender, minAge, maxAge, religion, ethnicity]);

  useEffect(() => { doSearch(0); }, []);

  const handleInterest = async (profileId: number) => {
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    try {
      await interestApi.send(profileId);
      setSentInterests(prev => new Set(prev).add(profileId));
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Could not send interest');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Find Your Match</h1>
          <p>Search from thousands of genuine Sri Lankan profiles</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <h3 className={styles.filterTitle}>🔍 Filter Matches</h3>

            <div className={styles.filterGroup}>
              <label>Looking For</label>
              <div className={styles.genderToggle}>
                {['', 'FEMALE', 'MALE'].map(g => (
                  <button
                    key={g}
                    className={`${styles.genderBtn} ${gender === g ? styles.active : ''}`}
                    onClick={() => setGender(g)}
                  >
                    {g === '' ? 'All' : g === 'FEMALE' ? '👰 Bride' : '🤵 Groom'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Age: {minAge} – {maxAge} years</label>
              <div className={styles.ageRow}>
                <input
                  type="range" min={18} max={maxAge} value={minAge}
                  onChange={e => setMinAge(+e.target.value)}
                  className={styles.slider}
                />
                <input
                  type="range" min={minAge} max={60} value={maxAge}
                  onChange={e => setMaxAge(+e.target.value)}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Religion</label>
              <select
                value={religion}
                onChange={e => setReligion(e.target.value)}
                className={styles.select}
              >
                <option value="">Any Religion</option>
                {RELIGIONS.map(r => (
                  <option key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Ethnicity</label>
              <select
                value={ethnicity}
                onChange={e => setEthnicity(e.target.value)}
                className={styles.select}
              >
                <option value="">Any Ethnicity</option>
                {ETHNICITIES.map(e => (
                  <option key={e} value={e}>
                    {e.charAt(0) + e.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <button className={styles.searchBtn} onClick={() => doSearch(0)}>
              Search Matches
            </button>
            <button className={styles.clearBtn} onClick={() => {
              setGender(''); setMinAge(18); setMaxAge(60);
              setReligion(''); setEthnicity('');
            }}>
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <main className={styles.results}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {loading ? 'Searching...' : `${total.toLocaleString()} matches found`}
            </span>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Finding your matches...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className={styles.empty}>
              <span>🔍</span>
              <h3>No profiles found</h3>
              <p>Try adjusting your search filters to find more matches.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {profiles.map(p => (
                  <ProfileCard
                    key={p.id}
                    profile={p}
                    onInterest={handleInterest}
                    interestSent={sentInterests.has(p.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    disabled={page === 0}
                    onClick={() => doSearch(page - 1)}
                    className={styles.pageBtn}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i).map(i => (
                    <button
                      key={i}
                      onClick={() => doSearch(i)}
                      className={`${styles.pageBtn} ${page === i ? styles.activePage : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => doSearch(page + 1)}
                    className={styles.pageBtn}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
