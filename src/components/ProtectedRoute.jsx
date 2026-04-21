import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute - Guards routes that require authentication
 * 
 * If user is not authenticated, redirects to login
 * If user is authenticated, renders the component
 * While checking auth, shows loading screen
 * 
 * Usage:
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 */

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking if user is authenticated, show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the component
  return children;
};
