// import { Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { formatDate } from '../utils/formatters';
import { SmartLink } from './SmartLink';
import { BookMenu } from './BookMenu';
import { AuthorizedAction } from './AuthorizedAction';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  selectMode?: boolean;
  selected?: boolean;
  onCardClick?: (book: Book) => void;
}

export const BookCard = ({ 
  book, 
  onEdit, 
  onDelete, 
  selectMode = false,
  selected = false,
  onCardClick
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

  // Card click handler for select mode
  const handleCardClick = (e: React.MouseEvent) => {
    if (selectMode && onCardClick) {
      e.preventDefault();
      onCardClick(book);
    }
  };

  return (
    <div
      className={`flex flex-col bg-white dark:bg-maroon-container shadow-md rounded overflow-hidden transition-all duration-300 hover:shadow-lg group w-[85%] mx-auto ${selectMode && selected ? 'ring-4 ring-rose-400 dark:ring-maroon-accent' : ''} ${selectMode ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="h-[340px] relative bg-gray-100 dark:bg-gray-700 rounded shadow overflow-hidden">
        {(onEdit || onDelete) && !selectMode && (
          <div className="absolute top-2 right-2 z-20" onClick={e => e.stopPropagation()}>
            <AuthorizedAction>
              <BookMenu 
                book={book} 
                onEdit={onEdit ? onEdit : () => {}}
                onDelete={onDelete ? onDelete : () => {}}
              />
            </AuthorizedAction>
          </div>
        )}
        {selectMode && (
          <div className="absolute top-2 left-2 z-30">
            <span className={`inline-block w-6 h-6 rounded-full border-2 ${selected ? 'bg-rose-500 border-rose-600' : 'bg-white border-gray-300'} flex items-center justify-center transition-colors`}>
              {selected && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
            </span>
          </div>
        )}
        <SmartLink to={`/reviews/${book.slug}`} className="block w-full h-full pointer-events-none">
          <img
            src={book.cover_image ? book.cover_image : undefined}
            alt={`Cover for ${book.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white px-2 py-1 text-xs flex flex-col justify-end z-10"
               style={{ maxHeight: '25%', overflow: 'hidden' }}>
            <span className="font-semibold line-clamp-1">{book.title}</span>
            <span className="italic line-clamp-1">by {book.author}</span>
          </div>
        </SmartLink>
        {selectMode && selected && (
          <div className="absolute inset-0 bg-rose-400/20 dark:bg-maroon-accent/30 pointer-events-none transition-all duration-200" />
        )}
      </div>
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {renderStars(book.rating)}
        <span className="ml-1 text-xs text-gray-500 dark:text-maroon-secondary">({book.rating})</span>
      </div>
      {book.review_date && (
        <p className="text-[10px] text-gray-400 dark:text-maroon-secondary mb-2 text-center">Reviewed: {formatDate(book.review_date)}</p>
      )}
    </div>
  );
}; 