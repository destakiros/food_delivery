
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('qb_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Construct user object from API response structure
      setUser({
        id: parsed._id || parsed.id,
        name: parsed.name,
        email: parsed.email,
        role: parsed.role,
        token: parsed.token
      } as any);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiService.post('/auth/login', { email, password });
    const userData = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token
    };
    setUser(userData as any);
    localStorage.setItem('qb_user', JSON.stringify(data));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiService.post('/auth/register', { name, email, password });
    const userData = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token
    };
    setUser(userData as any);
    localStorage.setItem('qb_user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qb_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem('qb_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
