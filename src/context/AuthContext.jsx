import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('darDiafa_currentUser');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const accounts = JSON.parse(localStorage.getItem('darDiafa_accounts') || '[]');
    const foundUser = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (foundUser) {
      // Don't store password in session
      const { password, ...userSession } = foundUser;
      setUser(userSession);
      localStorage.setItem('darDiafa_currentUser', JSON.stringify(userSession));
      return { success: true };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const register = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const accounts = JSON.parse(localStorage.getItem('darDiafa_accounts') || '[]');
    
    if (accounts.some(acc => acc.email === userData.email)) {
      return { success: false, message: 'Email already in use' };
    }
    
    const newUser = {
      idClient: crypto.randomUUID(),
      id: crypto.randomUUID(),
      ...userData
    };
    
    accounts.push(newUser);
    localStorage.setItem('darDiafa_accounts', JSON.stringify(accounts));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('darDiafa_currentUser');
  };

  const updateProfile = async (updates) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const accounts = JSON.parse(localStorage.getItem('darDiafa_accounts') || '[]');
    const index = accounts.findIndex(acc => acc.idClient === user.idClient || acc.id === user.id);
    
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates };
      localStorage.setItem('darDiafa_accounts', JSON.stringify(accounts));
      
      const { password, ...updatedSession } = accounts[index];
      setUser(updatedSession);
      localStorage.setItem('darDiafa_currentUser', JSON.stringify(updatedSession));
      return { success: true };
    }
    return { success: false, message: 'User not found' };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
