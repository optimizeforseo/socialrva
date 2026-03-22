"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for storage changes (for cross-tab sync and callback updates)
    const handleStorageChange = () => {
      initAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login function
  const login = (userData, authToken) => {
    try {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('socialrva_user_data');
    localStorage.removeItem('socialrva_onboarding_complete');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Complete onboarding
  const completeOnboarding = (onboardingData) => {
    try {
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          ...onboardingData,
          isOnboardingComplete: true
        },
        preferences: {
          ...user.preferences,
          ...onboardingData
        }
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('socialrva_onboarding_complete', 'true');
      setUser(updatedUser);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Check if user needs onboarding
  const needsOnboarding = () => {
    return isAuthenticated && user && !user.profile?.isOnboardingComplete;
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const storedToken = token || localStorage.getItem('token');
      if (!storedToken) return;

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const freshUser = data.data.user;
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
        return freshUser;
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    completeOnboarding,
    needsOnboarding,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};