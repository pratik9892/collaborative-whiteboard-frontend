import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to use Auth Context
 * Makes it easy for any component to access auth state and functions
 * 
 * Usage in components:
 * const { user, isAuthenticated, loading, login, logout } = useAuth();
 */

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // If hook is used outside of AuthProvider, show error
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};
