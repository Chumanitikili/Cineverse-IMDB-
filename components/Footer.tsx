import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary mt-12">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} CineVerse. All rights reserved.</p>
        <p className="text-sm mt-1">Movie data is for demonstration purposes only.</p>
      </div>
    </footer>
  );
};

export default Footer;