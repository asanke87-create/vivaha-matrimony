import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './CreateProfile.module.css';

const STEPS = ['Personal Info', 'Location & Education', 'About You', 'Partner Preferences'];

const CreateProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: 'MALE', dateOfBirth: '',
    religion: 'BUDDHIST', ethnicity: 'SINHALESE', civilStatus: 'NEVER_MARRIED',
    height: 170, country: 'Sri Lanka', district: '', city: '',
    education: '', profession: '', employedIn: '', annualIncome: '',
    aboutMe: '', partnerExpectations: '',
    fatherOccupation: '', motherOccupation: '', siblings: 0,
  });

  const update = (field: string, value: any) =>
    setForm(f => ({ ...f, [field]: value }));

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
    </div>
  );

  const Input = ({ name, type = 'text', placeholder = '' }: { name: string; type?: string; placeholder?: string }) => (
    <input
      type={type}
      value={(form as any)[name]}
      onChange={e => update(name, type === 'number' ? +e.target.value : e.target.value)}
      placeholder={placeholder}
      className={styles.input}
    />
  );

  const Select = ({ name, options }: { name: string; options: string[] }) => (
    <select
      value={(form as any)[name]}
      onChange={e => update(name, e.target.value)}
      className={styles.select}
    >
      {options.map(o => (
        <option key={o} value={o}>
          {o.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
        </option>
      ))}
    </select>
  );

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await profileApi.create(form as any);
      if (user) login({ ...user, hasProfile: true });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create profile. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Create Your Matrimony Ad</h1>
          <p>Complete your profile to find your perfect match</p>
        </div>

        {/* Progress */}
        <div className={styles.progress}>
          {STEPS.map((s, i) => (
            <div key={s} className={`${styles.step} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
              <div className={styles.stepCircle}>{i < step ? '✓' : i + 1}</div>
              <span className={styles.stepLabel}>{s}</span>
            </div>
          ))}
        </div>

        {error && <div className={styles.error}>⚠️ {error}</div>}

        <div className={styles.formCard}>
          {step === 0 && (
            <div className={styles.stepContent}>
              <h2>Personal Information</h2>
              <div className={styles.row}>
                <Field label="First Name">
                  <Input name="firstName" placeholder="First name" />
                </Field>
                <Field label="Last Name">
                  <Input name="lastName" placeholder="Last name" />
                </Field>
              </div>
              <Field label="Gender">
                <div className={styles.radioGroup}>
                  {['MALE', 'FEMALE'].map(g => (
                    <label key={g} className={`${styles.radioBtn} ${form.gender === g ? styles.radioActive : ''}`}>
                      <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => update('gender', g)} hidden />
                      {g === 'MALE' ? '🤵 Groom' : '👰 Bride'}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Date of Birth">
                <Input name="dateOfBirth" type="date" />
              </Field>
              <div className={styles.row}>
                <Field label="Religion">
                  <Select name="religion" options={['BUDDHIST', 'HINDU', 'CHRISTIAN', 'CATHOLIC', 'ISLAM', 'OTHER']} />
                </Field>
                <Field label="Ethnicity">
                  <Select name="ethnicity" options={['SINHALESE', 'TAMIL', 'MUSLIM', 'BURGHER', 'OTHER']} />
                </Field>
              </div>
              <div className={styles.row}>
                <Field label="Civil Status">
                  <Select name="civilStatus" options={['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']} />
                </Field>
                <Field label="Height (cm)">
                  <Input name="height" type="number" />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={styles.stepContent}>
              <h2>Location & Education</h2>
              <div className={styles.row}>
                <Field label="Country">
                  <Input name="country" placeholder="Sri Lanka" />
                </Field>
                <Field label="District">
                  <Input name="district" placeholder="e.g. Colombo" />
                </Field>
              </div>
              <Field label="City">
                <Input name="city" placeholder="Your city" />
              </Field>
              <Field label="Education Level">
                <Select name="education" options={["Bachelor's Degree", "Master's Degree", 'PhD', 'Diploma', 'A/L', 'O/L']} />
              </Field>
              <div className={styles.row}>
                <Field label="Profession">
                  <Input name="profession" placeholder="e.g. Engineer" />
                </Field>
                <Field label="Employed In">
                  <Select name="employedIn" options={['Private Sector', 'Government', 'Self Employed', 'Business', 'Overseas', 'Not Employed']} />
                </Field>
              </div>
              <Field label="Annual Income">
                <Select name="annualIncome" options={['Below LKR 500,000', 'LKR 500,000 - 1,000,000', 'LKR 1,000,000 - 2,000,000', 'LKR 2,000,000 - 5,000,000', 'Above LKR 5,000,000']} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2>About You & Family</h2>
              <Field label="About Me">
                <textarea
                  value={form.aboutMe}
                  onChange={e => update('aboutMe', e.target.value)}
                  placeholder="Write a brief description about yourself, your personality and interests..."
                  className={styles.textarea}
                  rows={4}
                />
              </Field>
              <div className={styles.row}>
                <Field label="Father's Occupation">
                  <Input name="fatherOccupation" placeholder="e.g. Government Officer" />
                </Field>
                <Field label="Mother's Occupation">
                  <Input name="motherOccupation" placeholder="e.g. Homemaker" />
                </Field>
              </div>
              <Field label="Number of Siblings">
                <Input name="siblings" type="number" />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h2>Partner Preferences</h2>
              <Field label="What are you looking for in a partner?">
                <textarea
                  value={form.partnerExpectations}
                  onChange={e => update('partnerExpectations', e.target.value)}
                  placeholder="Describe your ideal partner's qualities, values, and what you're looking for in a relationship..."
                  className={styles.textarea}
                  rows={6}
                />
              </Field>
              <div className={styles.summary}>
                <h3>📋 Profile Summary</h3>
                <div className={styles.summaryGrid}>
                  <div><span>Name:</span> <strong>{form.firstName} {form.lastName}</strong></div>
                  <div><span>Gender:</span> <strong>{form.gender === 'MALE' ? 'Groom' : 'Bride'}</strong></div>
                  <div><span>Religion:</span> <strong>{form.religion}</strong></div>
                  <div><span>Location:</span> <strong>{form.city}, {form.country}</strong></div>
                  <div><span>Education:</span> <strong>{form.education}</strong></div>
                  <div><span>Profession:</span> <strong>{form.profession}</strong></div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.navBtns}>
            {step > 0 && (
              <button className={styles.prevBtn} onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className={styles.nextBtn} onClick={() => setStep(s => s + 1)}>
                Continue →
              </button>
            ) : (
              <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating your ad...' : '✨ Publish My Ad'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
