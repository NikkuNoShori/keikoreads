import { Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { formatDate } from '../utils/formatters';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 hover:shadow-lg">
      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={coverImage} 
          alt={`${book.title} cover`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/book-placeholder.jpg';
          }}
        />
        {book.genre && (
          <span className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
            {book.genre}
          </span>
        )}
      </div>
      
      {/* Book Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold line-clamp-2 mb-1">{book.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          by {book.author}
          {book.series && <span className="italic"> ({book.series})</span>}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          {renderStars(book.rating)}
          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
            ({book.rating}/5)
          </span>
        </div>
        
        {/* Description */}
        {book.description && (
          <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-3 mb-3">
            {book.description}
          </p>
        )}
        
        {/* Metadata */}
        <div className="mt-auto space-y-1 text-xs text-gray-500 dark:text-gray-400">
          {book.review_date && (
            <p>Reviewed: {formatDate(book.review_date)}</p>
          )}
          {book.publish_date && (
            <p>Published: {formatDate(book.publish_date)}</p>
          )}
          {book.pages && <p>Pages: {book.pages}</p>}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 pt-0 mt-2">
        {book.title === 'Where Shadows Meet' ? (
          <a 
            href="/legacy_html/shadowsmeet.html" 
            className="inline-block w-full text-center py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
            target="_blank" rel="noopener noreferrer"
          >
            Read Review
          </a>
        ) : (
          <Link 
            to={`/reviews/${book.id}`} 
            className="inline-block w-full text-center py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
          >
            Read Review
          </Link>
        )}
      </div>
    </div>
  );
}; 