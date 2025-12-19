
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
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.token === 'demo-token') setIsDemoMode(true);
      } catch (e) {
        localStorage.removeItem('qb_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Try real API first
    const data = await apiService.post('/auth/login', { email, password });
    
    if (data) {
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
    } else {
      // API failed or unavailable -> Use Demo Logic
      console.log("Switching to Demo Login logic...");
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const foundUser = demoUsers.find((u: any) => u.email === email && u.password === password);
      
      const isGuest = email === 'guest@example.com' && password === 'guest123';
      const isAdmin = email === 'admin@innout.com' && password === 'admin123';

      if (foundUser || isGuest || isAdmin) {
        let userData;
        if (isAdmin) {
          userData = { id: 'admin-id', name: 'System Admin', email: 'admin@innout.com', role: UserRole.ADMIN, token: 'demo-token', notifications: [] };
        } else if (isGuest) {
          userData = { id: 'guest-id', name: 'Guest User', email: 'guest@example.com', role: UserRole.CUSTOMER, token: 'demo-token', notifications: [] };
        } else {
          userData = { ...foundUser, token: 'demo-token' };
          delete userData.password;
        }
        
        setUser(userData as any);
        localStorage.setItem('qb_user', JSON.stringify(userData));
        setIsDemoMode(true);
      } else {
        throw new Error('Invalid email or password');
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Try real API first
    const data = await apiService.post('/auth/register', { name, email, password });
    
    if (data) {
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
    } else {
      // API failed or unavailable -> Use Demo Logic
      console.log("Switching to Demo Registration logic...");
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      if (demoUsers.find((u: any) => u.email === email)) {
        throw new Error('User already exists in demo mode');
      }

      const newUser = {
        id: 'demo-' + Date.now(),
        name,
        email,
        password, // Stored locally only for demo session
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
