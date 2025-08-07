
import React, { useState } from 'react';

interface StarRatingProps {
  count?: number;
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
  hoverColor?: string;
  inactiveColor?: string;
}

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  value,
  onChange,
  size = 24,
  color = "text-star",
  hoverColor = "text-accent",
  inactiveColor = "text-gray-600"
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (rating: number) => {
    if (onChange) {
      onChange(rating);
    }
  };

  const handleMouseOver = (rating: number) => {
    if (onChange) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (onChange) {
      setHoverValue(undefined);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((rating) => {
        const isFilled = (hoverValue || value) >= rating;
        const currentClass = isFilled ? (hoverValue ? hoverColor : color) : inactiveColor;
        
        return (
          <StarIcon
            key={rating}
            onClick={() => handleClick(rating)}
            onMouseOver={() => handleMouseOver(rating)}
            onMouseLeave={handleMouseLeave}
            style={{ width: size, height: size }}
            className={`cursor-${onChange ? 'pointer' : 'default'} transition-colors duration-200 ${currentClass}`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
