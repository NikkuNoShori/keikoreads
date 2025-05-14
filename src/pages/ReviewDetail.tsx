import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, NewBook } from '../types/BookTypes';
import { getBookBySlug, deleteBook, updateBook } from '../utils/bookService';
import { formatDate, formatExternalLink } from '../utils/formatters';
import { SmartLink } from '../components/SmartLink';
import { BookForm } from '../components/BookForm';
import { AuthorizedAction } from '../components/AuthorizedAction';

export const ReviewDetail = () => {
  const { slug } = useParams<{ slug: string }>();
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
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await getBookBySlug(slug);
        if (error) throw error;
        setBook(data);
        document.title = `Keiko Reads | ${data.title}`;
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [slug]);

  const handleDelete = async () => {
    if (!slug) return;
    setIsDeleting(true);
    try {
      // Find the book by slug to get its id
      const { data, error } = await getBookBySlug(slug);
      if (error || !data) throw error || new Error('Book not found');
      const { error: delError } = await deleteBook(data.id);
      if (delError) throw delError;
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
    if (!slug || !book) return;
    setIsSubmitting(true);
    try {
      // Find the book by slug to get its id
      const { data, error } = await getBookBySlug(slug);
      if (error || !data) throw error || new Error('Book not found');
      const { data: updated, error: updError } = await updateBook(data.id, bookData);
      if (updError) throw updError;
      setBook(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
    <>
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-1">
        {/* Left Column: Cover, Details, Rating */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3 gap-6">
          <div className="w-[200px] h-[280px] bg-gray-100 dark:bg-gray-700 rounded shadow overflow-hidden flex items-center justify-center mx-auto">
            <img
              src={book.cover_image || ''}
              alt={`Cover for ${book.title}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2">
            <div className="font-serif italic text-lg font-bold mb-2 pl-4 border-l-4 border-rose-200 dark:border-maroon-accent">Book Details</div>
            <div className="pl-8">
              <div className="mb-1"><span className="font-semibold">Title:</span> {book.title}</div>
              <div className="mb-1"><span className="font-semibold">Author:</span> {book.author}</div>
              {book.genre && <div className="mb-1"><span className="font-semibold">Genre:</span> {book.genre}</div>}
              {book.publish_date && <div className="mb-1"><span className="font-semibold">Published:</span> {formatDate(book.publish_date)}</div>}
              {book.pages && <div className="mb-1"><span className="font-semibold">Pages:</span> {book.pages}</div>}
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="font-serif italic text-lg font-bold mb-1 pl-4 border-l-4 border-rose-200 dark:border-maroon-accent">Rating:</div>
            <div className="flex items-center pl-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={
                  i < book.rating
                    ? 'text-black dark:text-white text-xl'
                    : 'text-gray-300 dark:text-gray-500 text-xl'
                }>★</span>
              ))}
              <span className="ml-2 text-base">({book.rating}/5)</span>
            </div>
          </div>
        </div>
        {/* Right Column: Description, Review, Links, Date, Thanks */}
        <div className="flex-1 flex flex-col gap-6 mt-10 md:mt-0">
          {/* Edit/Delete Buttons Above Divider */}
          <AuthorizedAction>
            <div className="flex justify-end space-x-2 mb-4 w-full">
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-base"
                disabled={isDeleting}
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent text-base"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </AuthorizedAction>
          {/* Description Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
            <span className="flex-shrink mx-3 font-serif italic text-lg text-gray-700 dark:text-gray-200">Description</span>
            <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none font-serif leading-relaxed">
            {book.description && (
              <>
                {book.description.length > 150 && !showFullDescription ? (
                  <>
                    <p className="line-clamp-5 not-italic">{book.description}</p>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => setShowFullDescription(true)}
                        className="text-blue-600 hover:underline text-xs font-medium mt-1 font-sans"
                      >
                        View more
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="not-italic">{book.description}</p>
                    {book.description.length > 150 && (
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setShowFullDescription(false)}
                          className="text-blue-600 hover:underline text-xs font-medium mt-1 font-sans"
                        >
                          View less
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {/* Review Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
            <span className="flex-shrink mx-3 font-serif italic text-lg text-gray-700 dark:text-gray-200">Review</span>
            <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none font-serif">
            <p className="not-italic">{book.review}</p>
          </div>
          {book.review_date && (
            <div className="text-center text-xs text-gray-500 dark:text-maroon-secondary mt-2">Date posted: {formatDate(book.review_date)}</div>
          )}
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {book.goodreads_link && (
              <SmartLink to={formatExternalLink(book.goodreads_link)} className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent rounded-none text-sm font-medium transition-colors">Goodreads</SmartLink>
            )}
            {book.storygraph_link && (
              <SmartLink to={formatExternalLink(book.storygraph_link)} className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent rounded-none text-sm font-medium transition-colors">Storygraph</SmartLink>
            )}
            {book.bookshop_link && (
              <SmartLink to={formatExternalLink(book.bookshop_link)} className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent rounded-none text-sm font-medium transition-colors">Bookshop.org</SmartLink>
            )}
            {book.barnes_noble_link && (
              <SmartLink to={formatExternalLink(book.barnes_noble_link)} className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent rounded-none text-sm font-medium transition-colors">Barnes & Noble</SmartLink>
            )}
          </div>
          <div className="my-4">
            <div className="border-t border-gray-400 dark:border-gray-600 w-full"></div>
          </div>
          <div className="mb-4 text-center text-xs text-gray-500 dark:text-maroon-secondary italic">
            Thanks to Netgalley & publisher for this ARC in exchange for honest review!
          </div>
        </div>
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
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full p-1 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-maroon-card dark:scrollbar-track-gray-900">
            <h2 className="text-2xl font-semibold font-serif italic text-center bg-transparent dark:bg-gray-800 py-2 rounded-t-2xl">
              Edit Book Review
            </h2>
            <div className="h-1 w-24 bg-maroon-card rounded-full mx-auto mb-0"></div>
            <BookForm 
              initialData={book || undefined} 
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
    </>
  );
}; 