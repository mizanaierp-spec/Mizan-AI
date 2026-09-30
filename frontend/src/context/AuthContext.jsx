import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as loginRequest, logout as clearSession } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mizan_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('mizan_token')));

  useEffect(() => {
    const token = localStorage.getItem('mizan_token');
    if (!token || token === 'demo-token') {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((response) => {
        const nextUser = response?.user || response?.data || null;
        setUser(nextUser);
        if (nextUser) localStorage.setItem('mizan_user', JSON.stringify(nextUser));
      })
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    if (!response?.token) throw new Error('لم يتم استلام رمز الدخول من الخادم');
    const nextUser = response.user || null;
    localStorage.setItem('mizan_token', response.token);
    if (nextUser) localStorage.setItem('mizan_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return response;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, isAuthenticated: Boolean(user && localStorage.getItem('mizan_token')), login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
