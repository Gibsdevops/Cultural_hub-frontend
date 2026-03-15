import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedUser, getToken, saveToken, logout as logoutService } from '../services/authService';

/**
 * AuthContext — Global authentication state
 * Provides: user, token, isLoggedIn, login, logout
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // checking saved session

  // ── Restore session on app load ──────────────────────────────────────────
  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getSavedUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const loginUser = (userData, authToken) => {
    saveToken(authToken, userData);
    setUser(userData);
    setToken(authToken);
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logoutUser = async () => {
    await logoutService();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!token,
      loading,
      loginUser,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;