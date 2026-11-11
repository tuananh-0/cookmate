import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cookmate_token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cookmate_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('cookmate_user');
      localStorage.removeItem('cookmate_token');
      return null;
    }
  });

  async function authenticate(endpoint, payload) {
    const { data } = await api.post(`/auth/${endpoint}`, payload);
    localStorage.setItem('cookmate_token', data.token);
    localStorage.setItem('cookmate_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('cookmate_token');
    localStorage.removeItem('cookmate_user');
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    const handleSessionExpired = () => { setToken(null); setUser(null); };
    window.addEventListener('cookmate:session-expired', handleSessionExpired);
    return () => window.removeEventListener('cookmate:session-expired', handleSessionExpired);
  }, []);

  const value = useMemo(() => ({ token, user, authenticate, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
