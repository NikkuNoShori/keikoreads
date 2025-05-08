import React from 'react';

interface BookCoverProps {
  coverImage: string;
  title: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Standard sizes for book covers to maintain consistency across the app
const sizeClasses = {
  sm: 'max-h-[253px]',
  md: 'max-h-[253px]',
  lg: 'max-h-[253px]',
};

export const BookCover: React.FC<BookCoverProps> = ({ 
  coverImage, 
  title, 
  className = '', 
  size = 'md'
}) => {
  const defaultImage = '/assets/default-book-cover.png';
  const sizeClass = sizeClasses[size] || '';
  
  return (
    <div 
      className={`h-full w-full relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${className}`}
    >
      <img
        src={coverImage || defaultImage}
        alt={`Cover for ${title}`}
        className={`w-full h-full object-contain ${sizeClass}`}
        onError={(e) => {
          // If image fails to load, set to default
          (e.target as HTMLImageElement).src = defaultImage;
        }}
      />
    </div>
  );
}; 