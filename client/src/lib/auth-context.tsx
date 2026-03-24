import { createContext, useContext, useMemo, useState } from 'react';
import { api } from './api';
import type { UserInfo } from './types';

const USER_STORAGE_KEY = 'user';

function readStoredUser(): UserInfo | null {
  const rawValue = localStorage.getItem(USER_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as UserInfo;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function storeUser(user: UserInfo | null): void {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(USER_STORAGE_KEY);
}

interface AuthContextValue {
  user: UserInfo | null;
  login: (login: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(() => readStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(loginName, password) {
        const response = await api.login(loginName, password);
        api.setToken(response.token);
        storeUser(response.user);
        setUser(response.user);
      },
      async loginAsGuest() {
        const response = await api.guest();
        api.setToken(null);
        storeUser(response.user);
        setUser(response.user);
      },
      logout() {
        api.setToken(null);
        storeUser(null);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
