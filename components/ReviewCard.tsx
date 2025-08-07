
import React from 'react';
import type { Review } from '../types';
import StarRating from './StarRating';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-text-primary">{review.reviewer}</h4>
        <StarRating value={review.rating} size={18} />
      </div>
      <p className="text-text-secondary leading-relaxed">{review.text}</p>
    </div>
  );
};

export default ReviewCard;
