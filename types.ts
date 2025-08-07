
export interface MovieSummary {
  id: string;
  title: string;
  year: string;
  posterUrl: string;
  avgRating: number;
}

export interface Review {
  reviewer: string;
  rating: number;
  text: string;
}

export interface PersonSummary {
  id: string;
  name: string;
  profileUrl: string;
}

export interface MovieDetail extends MovieSummary {
  plot: string;
  genres: string[];
  director: PersonSummary;
  cast: PersonSummary[];
  reviews: Review[];
}

export interface FilmographyItem {
  movieId: string;
  title: string;
  year: string;
  role: 'Actor' | 'Director';
}

export interface PersonDetail extends PersonSummary {
  bio: string;
  birthDate: string;
  profileUrl: string;
  filmography: FilmographyItem[];
}

export interface WatchlistItem extends MovieSummary {}

export interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (movie: WatchlistItem) => void;
  removeFromWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
}

export interface UserRating {
  rating: number;
  review?: string;
}

export interface UserRatingsContextType {
  ratings: Record<string, UserRating>;
  getRating: (movieId: string) => UserRating | undefined;
  setRating: (movieId: string, rating: number, review?: string) => void;
}
