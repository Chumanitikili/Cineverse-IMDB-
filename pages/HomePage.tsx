import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies, getPopularMovies, getRecentlyReleasedMovies } from '../services/geminiService';
import type { MovieSummary } from '../types';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const HomePage: React.FC = () => {
  const location = useLocation();
  
  // State for search
  const [searchResults, setSearchResults] = useState<MovieSummary[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // State for default view
  const [popularMovies, setPopularMovies] = useState<MovieSummary[]>([]);
  const [recentMovies, setRecentMovies] = useState<MovieSummary[]>([]);
  const [isDefaultLoading, setIsDefaultLoading] = useState(false);
  const [defaultError, setDefaultError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query) return;
    setIsSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);
    try {
      const results = await searchMovies(query);
      if (results.length === 0) {
          setSearchError(`No results found for "${query}". Try a different search.`);
      }
      setSearchResults(results);
    } catch (err) {
      setSearchError('An error occurred while searching. Please try again later.');
      console.error(err);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);
  
  const loadDefaultMovies = useCallback(async () => {
      setIsDefaultLoading(true);
      setDefaultError(null);
      try {
          const [popular, recent] = await Promise.all([
              getPopularMovies(),
              getRecentlyReleasedMovies(),
          ]);
          setPopularMovies(popular);
          setRecentMovies(recent);
      } catch (err) {
          setDefaultError('Could not load movie lists. Please refresh the page.');
          console.error(err);
      } finally {
          setIsDefaultLoading(false);
      }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
      // Clear default movies when searching
      setPopularMovies([]);
      setRecentMovies([]);
      performSearch(query);
    } else {
      // Clear search results and load default movies
      setSearchQuery('');
      setSearchResults([]);
      loadDefaultMovies();
    }
  }, [location.search, performSearch, loadDefaultMovies]);

  const renderSearchResults = () => {
    if (isSearchLoading) {
      return <Loader message={`Searching for "${searchQuery}"...`} />;
    }
    if (searchError) {
      return <div className="text-center py-20 text-accent text-xl">{searchError}</div>;
    }
    if (searchResults.length > 0) {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-text-primary">Search Results for "{searchQuery}"</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {searchResults.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const renderDefaultView = () => {
      if (isDefaultLoading) {
          return <Loader message="Loading movies..." />;
      }
      if (defaultError) {
          return <div className="text-center py-20 text-accent text-xl">{defaultError}</div>;
      }
      return (
        <div className="space-y-12">
            <section>
                 <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">Popular Movies</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {popularMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                 </div>
            </section>
            <section>
                 <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">Recently Released</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {recentMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                 </div>
            </section>
        </div>
      );
  }

  return (
    <div>
      {searchQuery ? renderSearchResults() : renderDefaultView()}
    </div>
  );
};

export default HomePage;