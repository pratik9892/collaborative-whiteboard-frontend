import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';

/**
 * AuthProvider - Manages all authentication state
 * Wraps around the entire app to provide auth context
 * 
 * This component:
 * 1. Manages user state using useState
 * 2. Implements login, register, logout functions
 * 3. Checks session on app load
 * 4. Provides all auth data to child components via Context
 */

export const AuthProvider = ({ children }) => {
  // ============ STATE ============
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initially true while checking session
  const [error, setError] = useState(null);

  // ============ FUNCTIONS ============

  /**
   * Register new user
   * Called from Register page
   */
  const register = async (name, email, username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend API
      const data = await registerUser(name, email, username, password);
      
      // Update state with user info
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * Called from Login page
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend API
      const data = await loginUser(email, password);
      
      // Update state with user info
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   * Called from any component that has logout button
   */
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend API to clear cookie
      await logoutUser();
      
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const errorMsg = err.message || 'Logout failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user has valid session
   * Called on app mount and when token might be expired
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Call backend to verify token from cookie
      const data = await getCurrentUser();
      
      // Token is valid, user is authenticated
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      // Token invalid or expired
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // ============ EFFECT - Run on component mount ============
  useEffect(() => {
    // Check if user has valid session when app loads
    checkAuth();
  }, []); // Empty dependency array = runs once on mount

  // ============ CONTEXT VALUE ============
  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Functions
    login,
    register,
    logout,
    checkAuth,
    setError // Allow components to clear errors
  };

  // ============ PROVIDER ============
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
