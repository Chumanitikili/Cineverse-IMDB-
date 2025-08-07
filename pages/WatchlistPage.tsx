
import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const WatchlistPage: React.FC = () => {
  const { watchlist } = useWatchlist();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 border-l-4 border-accent pl-4">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary rounded-lg">
          <h2 className="text-2xl font-semibold text-text-primary">Your watchlist is empty.</h2>
          <p className="mt-2 text-text-secondary">Add movies to your watchlist to see them here.</p>
          <Link to="/" className="mt-6 inline-block bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-500 transition-colors">
            Find Movies to Watch
          </Link>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
