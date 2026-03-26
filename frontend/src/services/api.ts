import axios from 'axios';
import { LoginForm, RegisterForm, SearchParams } from '../types';
import { DEMO_PROFILES, DEMO_USERS } from './mockData';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Helper: fake axios-like response ──────────────────────────────
const ok = (data: any) => Promise.resolve({ data });
const fail = (msg: string) => Promise.reject({ response: { data: { message: msg } } });

// ── Check if backend is reachable ─────────────────────────────────
let _backendAlive: boolean | null = null;
const isBackendAlive = async (): Promise<boolean> => {
  if (_backendAlive !== null) return _backendAlive;
  try {
    const res = await axios.get('/api/profiles/search?page=0&size=1&minAge=18&maxAge=60', { timeout: 2000 });
    // Must return JSON with a profiles array — not the HTML of index.html
    _backendAlive = res.data && typeof res.data === 'object' && Array.isArray(res.data.profiles);
  } catch {
    _backendAlive = false;
  }
  return _backendAlive ?? false;
};

// Reset cache every 30 s so switching backend on later auto-detects
setInterval(() => { _backendAlive = null; }, 30000);

// ── Auth API ──────────────────────────────────────────────────────
export const authApi = {
  register: async (data: Omit<RegisterForm, 'confirmPassword'>) => {
    if (await isBackendAlive()) return API.post('/auth/register', data);

    // Mock registration — store in sessionStorage
    const key = data.email.toLowerCase();
    if (DEMO_USERS[key]) return fail('Email already registered');
    const newUser = { id: 99, email: data.email, password: data.password, profileId: -1 };
    sessionStorage.setItem('mock_user_' + key, JSON.stringify(newUser));
    return ok({ message: 'Registration successful!' });
  },

  login: async (data: LoginForm) => {
    if (await isBackendAlive()) return API.post('/auth/login', data);

    // Check demo users
    const key = data.email.toLowerCase();
    const user = DEMO_USERS[key]
      ?? JSON.parse(sessionStorage.getItem('mock_user_' + key) || 'null');

    if (!user || user.password !== data.password)
      return fail('Invalid email or password');

    return ok({
      token: 'mock-jwt-token-' + user.id,
      userId: user.id,
      email: user.email,
      hasProfile: user.profileId > 0,
    });
  },
};

// ── Profile API ───────────────────────────────────────────────────
export const profileApi = {
  create: async (data: any) => {
    if (await isBackendAlive()) return API.post('/profiles', data);
    const token = localStorage.getItem('token') || '';
    const userId = parseInt(token.replace('mock-jwt-token-', '')) || 99;
    const newProfile = {
      ...data,
      id: 900 + userId,
      adId: 'AD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      age: Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / 31557600000),
      isVerified: false,
      photoUrl: '',
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem('mock_profile_' + userId, JSON.stringify(newProfile));
    return ok(newProfile);
  },

  getMe: async () => {
    if (await isBackendAlive()) return API.get('/profiles/me');
    const token = localStorage.getItem('token') || '';
    const userId = parseInt(token.replace('mock-jwt-token-', '')) || 0;
    const stored = sessionStorage.getItem('mock_profile_' + userId);
    if (stored) return ok(JSON.parse(stored));
    const profile = DEMO_PROFILES.find(p => p.id === userId);
    if (profile) return ok(profile);
    return Promise.reject({ response: { status: 404 } });
  },

  getById: async (id: number) => {
    if (await isBackendAlive()) return API.get(`/profiles/${id}`);
    const p = DEMO_PROFILES.find(p => p.id === id);
    if (p) return ok(p);
    return Promise.reject({ response: { status: 404 } });
  },

  search: async (params: Partial<SearchParams>) => {
    if (await isBackendAlive()) return API.get('/profiles/search', { params });

    let results = [...DEMO_PROFILES];
    if (params.gender) results = results.filter(p => p.gender === params.gender);
    if (params.religion) results = results.filter(p => p.religion === params.religion);
    if (params.ethnicity) results = results.filter(p => p.ethnicity === params.ethnicity);
    if (params.minAge) results = results.filter(p => p.age >= params.minAge!);
    if (params.maxAge) results = results.filter(p => p.age <= params.maxAge!);

    const size = params.size ?? 12;
    const page = params.page ?? 0;
    const paged = results.slice(page * size, (page + 1) * size);

    return ok({
      profiles: paged,
      totalElements: results.length,
      totalPages: Math.ceil(results.length / size),
      currentPage: page,
    });
  },
};

// ── Interest API ──────────────────────────────────────────────────
const getMockInterests = () =>
  JSON.parse(sessionStorage.getItem('mock_interests') || '[]');

const saveMockInterests = (list: any[]) =>
  sessionStorage.setItem('mock_interests', JSON.stringify(list));

export const interestApi = {
  send: async (receiverProfileId: number) => {
    if (await isBackendAlive()) return API.post(`/interests/send/${receiverProfileId}`);
    const token = localStorage.getItem('token') || '';
    const userId = parseInt(token.replace('mock-jwt-token-', ''));
    const sender = DEMO_PROFILES.find(p => p.id === userId);
    const receiver = DEMO_PROFILES.find(p => p.id === receiverProfileId);
    if (!sender) return fail('Please create a profile first');
    const list = getMockInterests();
    const exists = list.find((i: any) => i.senderId === sender.id && i.receiverId === receiverProfileId);
    if (exists) return fail('Interest already sent');
    const newInterest = {
      id: Date.now(), senderId: sender.id,
      senderName: `${sender.firstName} ${sender.lastName}`,
      receiverId: receiverProfileId,
      receiverName: receiver ? `${receiver.firstName} ${receiver.lastName}` : 'Unknown',
      status: 'PENDING', sentAt: new Date().toISOString(),
    };
    saveMockInterests([...list, newInterest]);
    return ok(newInterest);
  },

  respond: async (interestId: number, accept: boolean) => {
    if (await isBackendAlive()) return API.put(`/interests/${interestId}/respond?accept=${accept}`);
    const list = getMockInterests();
    const updated = list.map((i: any) =>
      i.id === interestId ? { ...i, status: accept ? 'ACCEPTED' : 'DECLINED' } : i
    );
    saveMockInterests(updated);
    return ok(updated.find((i: any) => i.id === interestId));
  },

  getSent: async () => {
    if (await isBackendAlive()) return API.get('/interests/sent');
    const token = localStorage.getItem('token') || '';
    const userId = parseInt(token.replace('mock-jwt-token-', ''));
    const list = getMockInterests().filter((i: any) => i.senderId === userId);
    return ok(list);
  },

  getReceived: async () => {
    if (await isBackendAlive()) return API.get('/interests/received');
    const token = localStorage.getItem('token') || '';
    const userId = parseInt(token.replace('mock-jwt-token-', ''));
    const list = getMockInterests().filter((i: any) => i.receiverId === userId);
    return ok(list);
  },
};
