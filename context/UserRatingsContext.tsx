
import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserRating, UserRatingsContextType } from '../types';

const UserRatingsContext = createContext<UserRatingsContextType | undefined>(undefined);

export const UserRatingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useLocalStorage<Record<string, UserRating>>('userRatings', {});

  const setRating = useCallback((movieId: string, rating: number, review?: string) => {
    setRatings(prev => ({
      ...prev,
      [movieId]: { rating, review: review || prev[movieId]?.review },
    }));
  }, [setRatings]);

  const getRating = useCallback((movieId: string) => {
    return ratings[movieId];
  }, [ratings]);

  const value = { ratings, getRating, setRating };

  return (
    <UserRatingsContext.Provider value={value}>
      {children}
    </UserRatingsContext.Provider>
  );
};

export const useUserRatings = (): UserRatingsContextType => {
  const context = useContext(UserRatingsContext);
  if (context === undefined) {
    throw new Error('useUserRatings must be used within a UserRatingsProvider');
  }
  return context;
};
