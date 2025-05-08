// import { Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { formatDate, slugify } from '../utils/formatters';
import { SmartLink } from './SmartLink';
import { BookMenu } from './BookMenu';
import { AuthorizedAction } from './AuthorizedAction';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  selectMode?: boolean;
}

export const BookCard = ({ 
  book, 
  onEdit, 
  onDelete, 
  selectMode = false
}: BookCardProps) => {
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'} text-sm`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Extract book number from series if available
  const extractBookNumber = (series: string | null) => {
    if (!series) return null;
    
    // Check if series contains "Book X" or "#X" pattern
    const bookMatch = series.match(/book\s+(\d+)/i) || series.match(/#(\d+)/i);
    if (bookMatch) {
      return `Book ${bookMatch[1]}`;
    }
    return null;
  };

  const bookNumber = book.series ? extractBookNumber(book.series) : null;
  const seriesName = book.series 
    ? bookNumber 
      ? book.series.replace(new RegExp(`book\\s+${bookNumber.replace('Book ', '')}|#${bookNumber.replace('Book ', '')}`, 'i'), '').trim() 
      : book.series
    : null;

  return (
    <div className="book-card w-[240px] flex flex-col items-center bg-white dark:bg-maroon-container shadow-md rounded overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="w-[240px] h-[340px] relative bg-gray-100 dark:bg-gray-700 rounded shadow overflow-hidden">
        {(onEdit || onDelete) && !selectMode && (
          <div className="absolute top-2 right-2 z-20" onClick={e => e.stopPropagation()}>
            <AuthorizedAction>
              <BookMenu 
                book={book} 
                onEdit={book => onEdit?.(book)} 
                onDelete={book => onDelete?.(book)} 
              />
            </AuthorizedAction>
          </div>
        )}
        <SmartLink to={`/reviews/${slugify(book.title)}`} className="block w-full h-full">
          <img
            src={book.cover_image || ''}
            alt={`Cover for ${book.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white px-2 py-1 text-xs flex flex-col justify-end z-10"
               style={{ maxHeight: '25%', overflow: 'hidden' }}>
            <span className="font-semibold line-clamp-1">{book.title}</span>
            <span className="italic line-clamp-1">by {book.author}</span>
            {seriesName && (
              <span className="italic text-gray-300 line-clamp-1">{seriesName} {bookNumber && <span>{bookNumber}</span>}</span>
            )}
          </div>
        </SmartLink>
      </div>
      <div className="details w-full mt-2 px-2 text-center">
        <div className="flex items-center justify-center gap-1 mb-0.5">
          {renderStars(book.rating)}
          <span className="ml-1 text-xs text-gray-500 dark:text-maroon-secondary">({book.rating})</span>
        </div>
        {book.review_date && (
          <p className="text-[10px] text-gray-400 dark:text-maroon-secondary mb-0">Reviewed: {formatDate(book.review_date)}</p>
        )}
      </div>
    </div>
  );
}; 