
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
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('qb_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Try real API first
      const data = await apiService.post('/auth/login', { email, password });
      const userData = {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
        notifications: data.notifications || []
      };
      setUser(userData as any);
      localStorage.setItem('qb_user', JSON.stringify(userData));
      setIsDemoMode(false);
    } catch (error: any) {
      // Fallback to Demo Mode (LocalStorage Users)
      console.warn("API Login failed, switching to Demo Mode:", error.message);
      
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const foundUser = demoUsers.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData = { ...foundUser, token: 'demo-token' };
        delete userData.password;
        setUser(userData);
        localStorage.setItem('qb_user', JSON.stringify(userData));
        setIsDemoMode(true);
      } else if (email === 'admin@innout.com' && password === 'admin123') {
        // Hardcoded admin for convenience
        const adminUser = { id: 'admin-id', name: 'System Admin', email: 'admin@innout.com', role: UserRole.ADMIN, token: 'demo-token', notifications: [] };
        setUser(adminUser as any);
        localStorage.setItem('qb_user', JSON.stringify(adminUser));
        setIsDemoMode(true);
      } else {
        throw new Error('Invalid credentials');
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Try real API first
      const data = await apiService.post('/auth/register', { name, email, password });
      const userData = {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
        notifications: []
      };
      setUser(userData as any);
      localStorage.setItem('qb_user', JSON.stringify(userData));
      setIsDemoMode(false);
    } catch (error: any) {
      console.warn("API Register failed, using Demo Mode:", error.message);
      
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      if (demoUsers.find((u: any) => u.email === email)) {
        throw new Error('User already exists in demo mode');
      }

      const newUser = {
        id: 'demo-' + Date.now(),
        name,
        email,
        password, // Stored only for demo login
        role: UserRole.CUSTOMER,
        notifications: [{ id: '1', message: 'Welcome to In-N-Out Eats! (Demo Mode)', time: 'Just now', read: false }]
      };
      
      demoUsers.push(newUser);
      localStorage.setItem('demo_users', JSON.stringify(demoUsers));
      
      const sessionUser = { ...newUser, token: 'demo-token' };
      delete sessionUser.password;
      setUser(sessionUser as any);
      localStorage.setItem('qb_user', JSON.stringify(sessionUser));
      setIsDemoMode(true);
    }
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
