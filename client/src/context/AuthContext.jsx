import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

function readStoredSession() {
  const token = localStorage.getItem('cookmate_token');
  const serializedUser = localStorage.getItem('cookmate_user');

  try {
    const user = serializedUser ? JSON.parse(serializedUser) : null;
    if (token && user && typeof user === 'object' && !Array.isArray(user) && user.id) return { token, user };
  } catch {
    // Clear malformed session data below.
  }

  localStorage.removeItem('cookmate_token');
  localStorage.removeItem('cookmate_user');
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const { token, user } = session;

  async function authenticate(endpoint, payload) {
    const { data } = await api.post(`/auth/${endpoint}`, payload);
    localStorage.setItem('cookmate_token', data.token);
    localStorage.setItem('cookmate_user', JSON.stringify(data.user));
    setSession({ token: data.token, user: data.user });
    return data.user;
  }

  function logout() {
    localStorage.removeItem('cookmate_token');
    localStorage.removeItem('cookmate_user');
    setSession({ token: null, user: null });
  }

  useEffect(() => {
    const handleSessionExpired = () => { setSession({ token: null, user: null }); };
    window.addEventListener('cookmate:session-expired', handleSessionExpired);
    return () => window.removeEventListener('cookmate:session-expired', handleSessionExpired);
  }, []);

  const value = useMemo(() => ({ token, user, authenticate, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
