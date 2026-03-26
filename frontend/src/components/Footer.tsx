import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span>💍</span>
            <div>
              <span className={styles.logoMain}>Vivaha</span>
              <span className={styles.logoDot}>.lk</span>
            </div>
          </div>
          <p className={styles.tagline}>
            We combine cultural values with modern matchmaking, making it easy to
            meet someone who truly shares your background and dreams.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.social}>📘 Facebook</a>
            <a href="#" className={styles.social}>📸 Instagram</a>
            <a href="#" className={styles.social}>💬 WhatsApp</a>
          </div>
        </div>

        <div className={styles.links}>
          <h4>Quick Links</h4>
          <Link to="/search">Find Matches</Link>
          <Link to="/register">Create Ad</Link>
          <Link to="/login">Sign In</Link>
        </div>

        <div className={styles.links}>
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Pricing</a>
          <a href="#">Blog</a>
          <a href="#">Help Center</a>
        </div>

        <div className={styles.contact}>
          <h4>Contact</h4>
          <p>📍 No.01 Minuwangoda,<br />Sri Lanka</p>
          <p>📞 +94 112 824 814</p>
          <p>🕐 8:30 am – 8:30 pm (Mon–Sun)</p>
          <p>✉️ support@vivaha.lk</p>
        </div>
      </div>
    </div>

    <div className={styles.bottom}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} Vivaha.lk — Sri Lanka's #1 Matrimony Service</p>
        <div className={styles.legal}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
