
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('qb_user');
    const savedAllUsers = localStorage.getItem('demo_users');
    
    if (savedAllUsers) {
      setAllUsers(JSON.parse(savedAllUsers));
    } else {
      const initialUsers = [
        {
          id: 'demo-1',
          name: 'John Doe',
          email: 'customer@example.com',
          phone: '+251 911 223344',
          role: 'CUSTOMER',
          status: 'Active',
          notifications: []
        }
      ];
      setAllUsers(initialUsers);
      localStorage.setItem('demo_users', JSON.stringify(initialUsers));
    }

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

  const markNotificationsAsRead = () => {
    if (!user) return;
    const updatedNotifs = user.notifications.map(n => ({ ...n, read: true }));
    updateUser({ notifications: updatedNotifs });

    const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const updatedUsers = demoUsers.map((u) => {
      if (u.id === user.id) {
        return { ...u, notifications: (u.notifications || []).map((n) => ({ ...n, read: true })) };
      }
      return u;
    });
    localStorage.setItem('demo_users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  const login = async (email, password) => {
    if (email === 'admin@gmail.com' && password === 'admin123') {
      const adminData = {
        id: 'admin-primary',
        name: 'Super Admin',
        email: 'admin@gmail.com',
        role: 'ADMIN',
        token: 'demo-token',
        status: 'Active',
        notifications: []
      };
      setUser(adminData);
      localStorage.setItem('qb_user', JSON.stringify(adminData));
      setIsDemoMode(true);
      return;
    }

    const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const foundUser = demoUsers.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { ...foundUser, token: 'demo-token' };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('qb_user', JSON.stringify(userData));
      setIsDemoMode(true);
    } else {
      // In a real app, this would hit the API
      throw new Error('Invalid email or password');
    }
  };

  const register = async (name, email, password) => {
    const newUser = {
      id: 'demo-' + Date.now(),
      name,
      email,
      password,
      phone: '+251 900 000000',
      role: 'CUSTOMER',
      status: 'Active',
      notifications: [{ id: '1', message: 'Selam! Welcome to the IN-N-OUT family. We are so happy to have you here in Addis!', time: 'Just now', read: false }]
    };
    
    const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    demoUsers.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(demoUsers));
    setAllUsers(demoUsers);
    
    const sessionUser = { ...newUser, token: 'demo-token' };
    delete sessionUser.password;
    setUser(sessionUser);
    localStorage.setItem('qb_user', JSON.stringify(sessionUser));
    setIsDemoMode(true);
  };

  const addNotificationToUser = (userId, message) => {
    const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const updatedUsers = demoUsers.map((u) => {
      if (u.id === userId) {
        const newNotif = {
          id: Date.now().toString(),
          message,
          time: new Date().toLocaleTimeString(),
          read: false
        };
        return { ...u, notifications: [newNotif, ...(u.notifications || [])] };
      }
      return u;
    });
    
    localStorage.setItem('demo_users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    
    if (user?.id === userId) {
      const updatedUser = updatedUsers.find((u) => u.id === userId);
      const sessionUser = { ...updatedUser, token: 'demo-token' };
      delete sessionUser.password;
      setUser(sessionUser);
      localStorage.setItem('qb_user', JSON.stringify(sessionUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qb_user');
  };

  const updateUser = (userData) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem('qb_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, addNotificationToUser, markNotificationsAsRead, isDemoMode, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
