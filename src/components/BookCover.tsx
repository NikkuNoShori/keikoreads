import React from 'react';

interface BookCoverProps {
  coverImage: string;
  title: string;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ 
  coverImage, 
  title, 
  className = ''
}) => {
  // Default image if none is provided
  const imageSrc = coverImage || '/assets/book-placeholder.svg';
  
  // Standard book aspect ratio is typically around 2:3 (width:height)
  // Using aspect-[2/3] for precise ratio control
  return (
    <div className={`book-cover-container aspect-[2/3] shadow overflow-hidden ${className}`}>
      <img 
        src={imageSrc} 
        alt={`${title} cover`} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/assets/book-placeholder.svg';
        }}
      />
    </div>
  );
}; 