// import { Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { formatDate } from '../utils/formatters';
import { SmartLink } from './SmartLink';
import { BookCover } from './BookCover';
import { BookMenu } from './BookMenu';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const BookCard = ({ book, onEdit, onDelete }: BookCardProps) => {
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
    <div className="w-full h-full bg-white dark:bg-maroon-container shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-lg group relative">
      {/* Menu (if edit/delete handlers are provided) */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-10">
          <BookMenu 
            book={book} 
            onEdit={book => onEdit?.(book)} 
            onDelete={book => onDelete?.(book)} 
          />
        </div>
      )}
      
      {/* Cover Image - fixed aspect ratio */}
      <div className="aspect-[2/3] w-full relative overflow-hidden">
        <BookCover 
          coverImage={book.cover_image || ''} 
          title={book.title}
          className="h-full shadow"
        />
        {/* Overlay info section, contained within the image area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-400/95 px-2 py-1.5 transition-all duration-300 flex flex-col justify-start group-hover:bg-gray-500/95 min-h-0">
          <h2 className="text-sm font-semibold text-white mb-0.5 line-clamp-1 text-left">
            <SmartLink to={`/reviews/${book.id}`} className="hover:underline">
              {book.title}
            </SmartLink>
          </h2>
          <p className="text-white/90 text-xs mb-0.5 leading-tight text-left line-clamp-1">by {book.author}</p>
          
          {seriesName && (
            <p className="text-white/80 text-xs leading-tight italic text-left">
              {seriesName} {bookNumber && <span>{bookNumber}</span>}
            </p>
          )}
          
          <div className="flex items-center justify-start mb-0 mt-1">
            {renderStars(book.rating)}
            <span className="ml-1 text-xs text-white/80">({book.rating})</span>
          </div>
          
          {book.review_date && (
            <p className="text-white/70 text-[10px] mt-0.5 mb-0 leading-tight text-left">
              Reviewed: {formatDate(book.review_date)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 