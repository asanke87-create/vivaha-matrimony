import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>💍</span>
          <div>
            <span className={styles.logoMain}>Vivaha</span>
            <span className={styles.logoDot}>.LK</span>
            <div className={styles.logoTagline}>Sri Lanka's #1 Matrimony</div>
          </div>
        </Link>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
          <Link to="/search" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Find Matches
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {!user?.hasProfile && (
                <Link to="/create-profile" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                  Create Ad
                </Link>
              )}
              <button onClick={handleLogout} className={styles.btnOutline}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink} onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className={styles.btnPrimary} onClick={() => setMenuOpen(false)}>
                Create/Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
