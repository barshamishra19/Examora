'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Exam, ExamCategory, AppContextType } from '@/types/index';
import { getCurrentUser } from '@/services/authService';
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '@/lib/utils';

// Initialize default context value
const defaultContextValue: AppContextType = {
  user: null,
  accessToken: null,
  selectedExam: null,
  selectedCategory: null,
  isAuthenticated: false,
  isAuthLoading: true,
  setUser: () => {},
  setAuthSession: () => {},
  setSelectedExam: () => {},
  setSelectedCategory: () => {},
  logout: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const savedExam = getFromLocalStorage<Exam>('selectedExam');
        const savedCategory = getFromLocalStorage<ExamCategory>('selectedCategory');
        const savedToken = getFromLocalStorage<string>('accessToken');

        if (savedExam) {
          setSelectedExam(savedExam);
        }

        if (savedCategory) {
          setSelectedCategory(savedCategory);
        }

        if (!savedToken) {
          setIsAuthLoading(false);
          return;
        }

        setAccessToken(savedToken);
        const profile = await getCurrentUser(savedToken);
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[AppContext] Failed to restore auth session:', error);
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
        removeFromLocalStorage('user');
        removeFromLocalStorage('accessToken');
      } finally {
        setIsAuthLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  // Persist user changes
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);

    if (newUser) {
      setToLocalStorage('user', newUser);
    } else {
      removeFromLocalStorage('user');
    }
  };

  const handleSetAuthSession = (session: { user: User; accessToken: string } | null) => {
    if (!session) {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      removeFromLocalStorage('user');
      removeFromLocalStorage('accessToken');
      return;
    }

    setUser(session.user);
    setAccessToken(session.accessToken);
    setIsAuthenticated(true);
    setToLocalStorage('user', session.user);
    setToLocalStorage('accessToken', session.accessToken);
  };

  // Persist exam changes
  const handleSetSelectedExam = (exam: Exam | null) => {
    setSelectedExam(exam);

    if (exam) {
      setToLocalStorage('selectedExam', exam);
    } else {
      removeFromLocalStorage('selectedExam');
    }
  };

  // Persist category changes
  const handleSetSelectedCategory = (category: ExamCategory | null) => {
    setSelectedCategory(category);

    if (category) {
      setToLocalStorage('selectedCategory', category);
    } else {
      removeFromLocalStorage('selectedCategory');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setSelectedExam(null);
    setSelectedCategory(null);
    setIsAuthenticated(false);

    removeFromLocalStorage('user');
    removeFromLocalStorage('accessToken');
    removeFromLocalStorage('selectedExam');
    removeFromLocalStorage('selectedCategory');
  };

  const contextValue: AppContextType = {
    user,
    accessToken,
    selectedExam,
    selectedCategory,
    isAuthenticated,
    isAuthLoading,
    setUser: handleSetUser,
    setAuthSession: handleSetAuthSession,
    setSelectedExam: handleSetSelectedExam,
    setSelectedCategory: handleSetSelectedCategory,
    logout: handleLogout,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  return context;
};
