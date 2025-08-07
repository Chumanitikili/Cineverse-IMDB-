
import React from 'react';
import { Link } from 'react-router-dom';
import type { MovieSummary } from '../types';
import StarRating from './StarRating';

interface MovieCardProps {
  movie: MovieSummary;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform duration-300 group">
      <Link to={`/movie/${movie.id}/${encodeURIComponent(movie.title)}`}>
        <div className="relative">
          <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-full h-auto aspect-[2/3] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{movie.title}</h3>
            <p className="text-sm text-text-secondary">{movie.year}</p>
            <div className="mt-2 flex items-center">
                <StarRating value={movie.avgRating} size={16} />
                <span className="ml-2 text-sm text-text-secondary">{movie.avgRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
