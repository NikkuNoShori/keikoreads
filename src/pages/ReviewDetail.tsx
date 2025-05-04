import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, NewBook } from '../types/BookTypes';
import { getBookById, deleteBook, updateBook } from '../utils/bookService';
import { formatDate, formatExternalLink } from '../utils/formatters';
import { SmartLink } from '../components/SmartLink';
import { BookForm } from '../components/BookForm';
import { BookCover } from '../components/BookCover';

export const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data, error } = await getBookById(id);
        
        if (error) {
          throw error;
        }
        
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await deleteBook(id);
      
      if (error) {
        throw error;
      }
      
      // Redirect to reviews page after successful deletion
      navigate('/reviews');
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleUpdateBook = async (bookData: NewBook) => {
    if (!id || !book) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await updateBook(id, bookData);
      
      if (error) {
        throw error;
      }
      
      // Update the book state with the edited data
      setBook(data);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'} text-2xl`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading review...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <SmartLink to="/reviews" className="inline-block mt-4 text-rose-600 hover:underline">
            Return to Reviews
          </SmartLink>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Review not found</p>
        <SmartLink to="/reviews" className="inline-block mt-4 text-rose-600 hover:underline">
          Return to Reviews
        </SmartLink>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-1.5 py-2.5">
      {/* Book Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Cover Image */}
        <div className="w-full md:w-1/4">
          <div className="max-w-[220px] mx-auto md:mx-0">
            <BookCover 
              coverImage={book.cover_image || ''} 
              title={book.title}
              className="w-full shadow-md"
            />
          </div>
        </div>
        
        {/* Book Info */}
        <div className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            by {book.author}
            {book.series && <span className="italic"> ({book.series})</span>}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            {renderStars(book.rating)}
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {book.rating}/5
            </span>
          </div>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1 mb-4">
            {book.genre && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Genre:</span>{' '}
                <span className="font-medium">{book.genre}</span>
              </div>
            )}
            
            {book.publish_date && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Published:</span>{' '}
                <span className="font-medium">{formatDate(book.publish_date)}</span>
              </div>
            )}
            
            {book.pages && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Pages:</span>{' '}
                <span className="font-medium">{book.pages}</span>
              </div>
            )}
            
            {book.review_date && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Reviewed:</span>{' '}
                <span className="font-medium">{formatDate(book.review_date)}</span>
              </div>
            )}
          </div>
          
          {/* External Links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {book.goodreads_link && (
              <SmartLink to={formatExternalLink(book.goodreads_link)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Goodreads</SmartLink>
            )}
            
            {book.storygraph_link && (
              <SmartLink to={formatExternalLink(book.storygraph_link)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">StoryGraph</SmartLink>
            )}
            
            {book.bookshop_link && (
              <SmartLink to={formatExternalLink(book.bookshop_link)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Bookshop.org</SmartLink>
            )}
            
            {book.barnes_noble_link && (
              <SmartLink to={formatExternalLink(book.barnes_noble_link)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Barnes & Noble</SmartLink>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
            >
              Edit Review
            </button>
            
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Review'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Description and Review */}
      <div className="space-y-4 mb-6">
        {book.description && (
          <div>
            {/* Description divider similar to the Review divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-3 text-gray-600 dark:text-gray-400 font-serif font-medium tracking-wide text-sm">Description</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="prose prose-xs text-sm dark:prose-invert max-w-none font-serif leading-relaxed">
              {book.description.length > 150 && !showFullDescription ? (
                <>
                  <p className="line-clamp-5">{book.description}</p>
                  <button 
                    onClick={() => setShowFullDescription(true)}
                    className="text-blue-600 hover:underline text-xs font-medium mt-1 font-sans"
                  >
                    View more
                  </button>
                </>
              ) : (
                <>
                  <p>{book.description}</p>
                  {book.description.length > 150 && (
                    <button 
                      onClick={() => setShowFullDescription(false)}
                      className="text-blue-600 hover:underline text-xs font-medium mt-1 font-sans"
                    >
                      View less
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Divider with Review in the middle */}
        {book.review && (
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-3 text-gray-600 dark:text-gray-400 font-medium text-sm">Review</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
        )}
        
        {book.review && (
          <div>
            <div className="prose prose-sm dark:prose-invert max-w-none font-serif italic">
              <p>{book.review}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Read-Alikes Image */}
      {book.read_alikes_image && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Similar Reads</h2>
          <div className="overflow-hidden shadow-md rounded">
            <img
              src={book.read_alikes_image}
              alt="Similar book recommendations"
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
      
      {/* Back to Reviews */}
      <div className="mt-6">
        <SmartLink to="/reviews" className="text-rose-600 hover:underline">
          ← Back to All Reviews
        </SmartLink>
      </div>
      
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full p-1 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-maroon-card dark:scrollbar-track-gray-900">
            <h2 className="text-2xl font-semibold font-serif italic text-center bg-transparent dark:bg-gray-800 py-2 rounded-t-2xl">
              Edit Book Review
            </h2>
            <div className="h-1 w-24 bg-maroon-card rounded-full mx-auto mb-0"></div>
            <BookForm 
              initialData={book} 
              onSubmit={handleUpdateBook} 
              onCancel={() => setShowEditModal(false)} 
              isSubmitting={isSubmitting} 
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the review for "{book.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 