
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/geminiService';
import type { MovieDetail, Review } from '../types';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import PersonCard from '../components/PersonCard';
import { useWatchlist } from '../context/WatchlistContext';
import { useUserRatings } from '../context/UserRatingsContext';

const MovieDetailPage: React.FC = () => {
  const { id, title } = useParams<{ id: string, title: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { getRating, setRating } = useUserRatings();

  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (id && title) {
      const fetchMovie = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getMovieDetails(id, decodeURIComponent(title));
          setMovie(data);
          const existingRating = getRating(id);
          if (existingRating) {
            setUserRating(existingRating.rating);
            setReviewText(existingRating.review || '');
          }
        } catch (err) {
          setError('Failed to fetch movie details.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovie();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    if(id) {
       setRating(id, rating, reviewText);
    }
  };
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && userRating > 0) {
      setRating(id, userRating, reviewText);
      alert('Your review has been saved!');
    }
  };

  const allReviews = useMemo(() => {
    if (!movie || !id) return [];
    const aiReviews = movie.reviews || [];
    const userReviewData = getRating(id);
    if(userReviewData && userReviewData.review) {
        const userReview: Review = { reviewer: 'You', rating: userReviewData.rating, text: userReviewData.review };
        // Prevent duplicate reviews if user name is 'You'
        return [userReview, ...aiReviews.filter(r => r.reviewer.toLowerCase() !== 'you')];
    }
    return aiReviews;
  }, [movie, id, getRating]);

  if (isLoading) return <Loader message="Summoning movie details..." />;
  if (error) return <div className="text-center py-20 text-accent text-xl">{error}</div>;
  if (!movie) return <div className="text-center py-20 text-text-secondary text-xl">Movie not found.</div>;

  const isMovieInWatchlist = id ? isInWatchlist(id) : false;

  const handleWatchlistToggle = () => {
    if (!id) return;
    if (isMovieInWatchlist) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex-shrink-0">
          <img src={movie.posterUrl} alt={movie.title} className="rounded-lg shadow-xl w-full" />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">{movie.title} <span className="text-text-secondary font-light">({movie.year})</span></h1>
          <div className="mt-4 flex items-center space-x-4">
            <StarRating value={movie.avgRating} />
            <span className="text-xl">{movie.avgRating.toFixed(1)}/5.0</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map(genre => <span key={genre} className="bg-tertiary text-sm px-3 py-1 rounded-full">{genre}</span>)}
          </div>
          <p className="mt-6 text-text-secondary leading-relaxed">{movie.plot}</p>
          <div className="mt-6">
             <button
                onClick={handleWatchlistToggle}
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${isMovieInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-accent hover:bg-pink-500'} text-white`}
              >
                {isMovieInWatchlist ? '✓ Added to Watchlist' : '+ Add to Watchlist'}
              </button>
          </div>
        </div>
      </div>
      
      {/* Cast Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">Cast & Crew</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="text-xl font-semibold mb-3 text-text-secondary">Director</h3>
                <PersonCard person={movie.director} role="Director" />
            </div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3 text-text-secondary">Main Cast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movie.cast.map(actor => <PersonCard key={actor.id} person={actor} role="Actor" />)}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">Reviews</h2>
          <div className="space-y-4">
            {allReviews.map((review, index) => <ReviewCard key={`${review.reviewer}-${index}`} review={review} />)}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">Your Rating</h2>
          <form onSubmit={handleReviewSubmit} className="bg-secondary p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Rate this movie</h3>
            <div className="flex justify-center mb-4">
                <StarRating value={userRating} onChange={handleRatingChange} size={32} />
            </div>
            
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write an optional review..."
              className="w-full bg-primary p-3 rounded-md border border-tertiary focus:outline-none focus:ring-2 focus:ring-accent h-32 resize-none"
            ></textarea>
            <button type="submit" className="w-full bg-accent text-white font-bold py-3 mt-4 rounded-lg hover:bg-pink-500 transition-colors disabled:bg-gray-500" disabled={userRating === 0}>
                Submit Your Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
