// import { Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { formatDate } from '../utils/formatters';
import { SmartLink } from './SmartLink';
import { BookCover } from './BookCover';
import { BookMenu } from './BookMenu';
import { AuthorizedAction } from './AuthorizedAction';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  selectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (bookId: string) => void;
}

export const BookCard = ({ 
  book, 
  onEdit, 
  onDelete, 
  selectMode = false,
  isSelected = false,
  onToggleSelect
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

  const handleCardClick = () => {
    if (selectMode && onToggleSelect) {
      onToggleSelect(book.id);
    }
  };

  return (
    <div 
      className={`w-full h-full bg-white dark:bg-maroon-container shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg group relative
        ${selectMode ? 'cursor-pointer' : ''}
        ${selectMode && isSelected ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-maroon-card dark:ring-offset-1' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Checkbox for selection */}
      {selectMode && (
        <div className="absolute top-2 left-2 z-10">
          <div className="w-5 h-5 bg-white dark:bg-gray-800 rounded-sm border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            {isSelected && (
              <svg className="w-4 h-4 text-rose-600 dark:text-maroon-card" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Menu (if edit/delete handlers are provided) */}
      {(onEdit || onDelete) && !selectMode && (
        <div className="absolute top-2 right-2 z-10">
          <AuthorizedAction>
            <BookMenu 
              book={book} 
              onEdit={book => onEdit?.(book)} 
              onDelete={book => onDelete?.(book)} 
            />
          </AuthorizedAction>
        </div>
      )}
      
      {/* Cover Image - fixed aspect ratio */}
      <div className="aspect-[2/3] w-full relative overflow-hidden">
        <BookCover 
          coverImage={book.cover_image || ''} 
          title={book.title}
          className="h-full shadow"
          size="md"
        />
        {/* Overlay info section, contained within the image area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-400/95 px-2 py-1.5 transition-all duration-300 flex flex-col justify-start group-hover:bg-gray-500/95 min-h-0">
          <h2 className="text-sm font-semibold text-white mb-0.5 line-clamp-1 text-left">
            {!selectMode ? (
              <SmartLink to={`/reviews/${book.id}`} className="hover:underline">
                {book.title}
              </SmartLink>
            ) : (
              book.title
            )}
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