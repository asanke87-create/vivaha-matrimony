import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      const loginRes = await authApi.login({ email: form.email, password: form.password });
      login(loginRes.data);
      navigate('/create-profile');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.logoArea}>
            <span className={styles.emoji}>💍</span>
            <h1 className={styles.brand}>
              <span className={styles.brandMain}>Vivaha</span>
              <span className={styles.brandDot}>.lk</span>
            </h1>
          </div>

          <h2 className={styles.title}>Create Your Free Ad</h2>
          <p className={styles.subtitle}>Join 50,000+ Sri Lankans finding their partner</p>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className={styles.input}
              />
            </div>

            <p className={styles.terms}>
              By registering, you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
