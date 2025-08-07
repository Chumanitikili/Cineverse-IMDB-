
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v16H4V4zm2 4v2h12V8H6zm0 4v2h12v-2H6zm0 4v2h12v-2H6z" />
    <path d="M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v2H6V4zm0 14h12v2H6v-2zm0-4h12v2H6v-2zm0-4h12v2H6V8z" />
  </svg>
);

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-secondary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <FilmIcon className="h-10 w-10 text-accent"/>
            <span className="text-2xl font-black tracking-wider uppercase">CineVerse</span>
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6 text-lg">
              <NavLink to="/" className={({ isActive }) => `hover:text-accent transition-colors ${isActive ? 'text-accent' : 'text-text-secondary'}`}>Home</NavLink>
              <NavLink to="/watchlist" className={({ isActive }) => `hover:text-accent transition-colors ${isActive ? 'text-accent' : 'text-text-secondary'}`}>Watchlist</NavLink>
            </nav>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                name="search"
                placeholder="Search by title or genre..."
                className="bg-primary border border-tertiary rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent transition-all w-48 md:w-64"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
