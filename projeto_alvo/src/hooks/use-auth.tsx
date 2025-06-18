"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://placehold.co/100x100.png',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status
    const storedUser = localStorage.getItem('lexai-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'test@example.com' && pass === 'password') {
      localStorage.setItem('lexai-user', JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      router.push('/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
    setLoading(false);
  };

  const signup = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { ...MOCK_USER, email, id: `mock-user-${Date.now()}` };
    localStorage.setItem('lexai-user', JSON.stringify(newUser));
    setUser(newUser);
    router.push('/dashboard');
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('lexai-user');
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
