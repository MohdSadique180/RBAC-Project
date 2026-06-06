import { useState, useCallback } from 'react';
import type { User, AuthResponse } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const saveAuth = useCallback((authResponse: AuthResponse) => {
    localStorage.setItem('token', authResponse.token);
    const userData: User = {
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return { user, isAuthenticated, isAdmin, saveAuth, logout };
}
