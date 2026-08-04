import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { loginRequest, logoutRequest, meRequest, registerRequest } from '../api/auth.api';

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meRequest()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const user = await loginRequest(email, password);
    setCurrentUser(user);
  }

  async function register(name: string, email: string, password: string) {
    const user = await registerRequest(name, email, password);
    setCurrentUser(user);
  }

  async function logout() {
    await logoutRequest();
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
