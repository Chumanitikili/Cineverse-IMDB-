
import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { WatchlistItem, WatchlistContextType } from '../types';

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('watchlist', []);

  const addToWatchlist = useCallback((movie: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.find(item => item.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  }, [setWatchlist]);

  const removeFromWatchlist = useCallback((movieId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== movieId));
  }, [setWatchlist]);

  const isInWatchlist = useCallback((movieId: string) => {
    return watchlist.some(item => item.id === movieId);
  }, [watchlist]);

  const value = { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
