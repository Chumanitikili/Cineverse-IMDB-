
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-9xl font-black text-accent">404</h1>
      <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
      <p className="text-text-secondary mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 inline-block bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-500 transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
