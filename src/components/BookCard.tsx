// import { Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { formatDate } from '../utils/formatters';
import { SmartLink } from './SmartLink';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  // Default image if none is provided
  const coverImage = book.cover_image || '/assets/book-placeholder.jpg';
  
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'} text-lg`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-maroon-container rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 hover:shadow-lg group relative">
      {/* Cover Image */}
      <div className="relative h-[28rem] overflow-hidden bg-white dark:bg-maroon-container">
        <img 
          src={coverImage} 
          alt={`${book.title} cover`} 
          className="w-full h-[28rem] object-contain object-top bg-white dark:bg-maroon-container"
          onError={(e) => {
            e.currentTarget.src = '/assets/book-placeholder.jpg';
          }}
        />
        {book.genre && (
          <span className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
            {book.genre}
          </span>
        )}
        {/* Overlay info section, contained within the image area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-400/95 p-3 rounded-b-lg transition-all duration-300 flex flex-col justify-center group-hover:bg-gray-500/95">
          <h2 className="text-lg font-semibold text-white mb-0 line-clamp-2">
            <SmartLink to={`/reviews/${book.id}`} className="hover:underline">
              {book.title}
            </SmartLink>
          </h2>
          <p className="text-white/90 text-xs mb-0">by {book.author}{book.series && <span className="italic"> ({book.series})</span>}</p>
          <div className="flex items-center justify-center mb-0 mt-1">
            {renderStars(book.rating)}
            <span className="ml-1 text-xs text-white/80">({book.rating}/5)</span>
          </div>
          {book.review_date && (
            <p className="text-white/70 text-xs mt-1 mb-0">Reviewed: {formatDate(book.review_date)}</p>
          )}
        </div>
      </div>
    </div>
  );
}; 