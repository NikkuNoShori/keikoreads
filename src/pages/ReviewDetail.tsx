import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Book } from '../types/BookTypes';
import { getBookById, deleteBook } from '../utils/bookService';
import { formatDate, formatExternalLink } from '../utils/formatters';

export const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
          <Link to="/reviews" className="inline-block mt-4 text-rose-600 hover:underline">
            Return to Reviews
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Review not found</p>
        <Link to="/reviews" className="inline-block mt-4 text-rose-600 hover:underline">
          Return to Reviews
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Book Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Cover Image */}
        <div className="w-full md:w-1/3">
          <img 
            src={book.cover_image || '/assets/book-placeholder.jpg'} 
            alt={`${book.title} cover`}
            className="w-full h-auto rounded-lg shadow-md"
            onError={(e) => {
              e.currentTarget.src = '/assets/book-placeholder.jpg';
            }}
          />
        </div>
        
        {/* Book Info */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
            by {book.author}
            {book.series && <span className="italic"> ({book.series})</span>}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            {renderStars(book.rating)}
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {book.rating}/5
            </span>
          </div>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
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
          <div className="flex flex-wrap gap-3 mb-6">
            {book.goodreads_link && (
              <a 
                href={formatExternalLink(book.goodreads_link)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Goodreads
              </a>
            )}
            
            {book.storygraph_link && (
              <a 
                href={formatExternalLink(book.storygraph_link)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                StoryGraph
              </a>
            )}
            
            {book.bookshop_link && (
              <a 
                href={formatExternalLink(book.bookshop_link)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Bookshop.org
              </a>
            )}
            
            {book.barnes_noble_link && (
              <a 
                href={formatExternalLink(book.barnes_noble_link)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Barnes & Noble
              </a>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to={`/reviews/${book.id}/edit`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Edit Review
            </Link>
            
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Review'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Description and Review */}
      <div className="space-y-8 mb-10">
        {book.description && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{book.description}</p>
            </div>
          </div>
        )}
        
        {book.review && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">Review</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{book.review}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Read-Alikes Image */}
      {book.read_alikes_image && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Similar Reads</h2>
          <img
            src={book.read_alikes_image}
            alt="Similar book recommendations"
            className="max-w-full h-auto rounded-lg shadow-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Back to Reviews */}
      <div className="mt-10">
        <Link to="/reviews" className="text-rose-600 hover:underline">
          ← Back to All Reviews
        </Link>
      </div>
      
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