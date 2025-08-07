
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import NotFoundPage from './pages/NotFoundPage';
import { WatchlistProvider } from './context/WatchlistContext';
import { UserRatingsProvider } from './context/UserRatingsContext';

const App: React.FC = () => {
  return (
    <UserRatingsProvider>
      <WatchlistProvider>
        <HashRouter>
          <div className="bg-primary text-text-primary min-h-screen font-sans flex flex-col">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id/:title" element={<MovieDetailPage />} />
                <Route path="/person/:id/:name" element={<PersonDetailPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </WatchlistProvider>
    </UserRatingsProvider>
  );
};

export default App;
