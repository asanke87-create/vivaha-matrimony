import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data);
      navigate(res.data.hasProfile ? '/dashboard' : '/create-profile');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
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

          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to your account to find your match</p>

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
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}><span>or try a demo account</span></div>

          <div className={styles.demo}>
            <p className={styles.demoHint}>Click any account below to auto-fill:</p>
            <div className={styles.demoAccounts}>
              {[
                { email: 'nimal@email.com', name: 'Nimal (Groom)' },
                { email: 'kumari@email.com', name: 'Kumari (Bride)' },
                { email: 'rohan@email.com', name: 'Rohan (Overseas)' },
              ].map(d => (
                <button
                  key={d.email}
                  className={styles.demoBtn}
                  type="button"
                  onClick={() => setForm({ email: d.email, password: 'password123' })}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <p className={styles.demoPass}>Password for all: <strong>password123</strong></p>
          </div>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.switchLink}>Create Free Ad</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
