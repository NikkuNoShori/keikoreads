import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, NewBook } from '../types/BookTypes';
import { SmartLink } from '../components/SmartLink';
import { BookCover } from '../components/BookCover';
import { supabase } from '../utils/supabaseClient';
import { AuthorizedAction } from '../components/AuthorizedAction';
import { BookForm } from '../components/BookForm';
import { updateBook, deleteBook } from '../utils/bookService';

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        setError('Book not found.');
        setBook(null);
      } else {
        setBook(data as Book);
      }
      setLoading(false);
    };
    if (id) fetchBook();
  }, [id]);

  const handleEditBook = () => {
    setShowModal(true);
  };

  const handleDeleteBook = () => {
    setShowDeleteConfirm(true);
  };

  const handleBookSubmit = async (bookData: NewBook) => {
    if (!book || !id) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await updateBook(id, bookData);
      if (!error && data) {
        // Refresh data
        setBook(data as Book);
        setShowModal(false);
      } else {
        alert(error?.message || 'Error updating review');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!id) return;
    
    const { error } = await deleteBook(id);
    if (!error) {
      // Redirect to reviews page
      navigate('/reviews');
    } else {
      alert(`Error deleting review: ${error.message}`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteConfirm(false);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !book) return <div className="text-center py-10 text-red-600">{error || 'Book not found.'}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-maroon-container shadow-lg rounded-lg overflow-hidden mt-4">
      {/* Action Buttons for Authenticated Users */}
      <div className="flex justify-end p-4">
        <AuthorizedAction>
          <div className="flex space-x-3">
            <button
              onClick={handleEditBook}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit Review
            </button>
            <button
              onClick={handleDeleteBook}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete Review
            </button>
          </div>
        </AuthorizedAction>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Book Info Sidebar */}
        <aside className="book-info flex-shrink-0 w-full md:w-64 flex flex-col items-center md:items-start">
          <div className="w-full max-w-[180px] mb-6">
            <BookCover 
              coverImage={book.cover_image || ''} 
              title={book.title}
              className="shadow-md"
            />
          </div>
          <div className="book-details mb-4 w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-maroon-text font-serif italic tracking-wide border-l-4 border-rose-100 dark:border-maroon-accent pl-2">Book Details</h2>
            <div className="grid gap-1 pl-3">
              <p className="text-gray-700 dark:text-maroon-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-bold inline-block w-20">Author:</span> {book.author}
              </p>
              {book.series && (
                <p className="text-gray-700 dark:text-maroon-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-bold inline-block w-20">Series:</span> {book.series}
                </p>
              )}
              {book.genre && (
                <p className="text-gray-700 dark:text-maroon-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-bold inline-block w-20">Genre:</span> {book.genre}
                </p>
              )}
              {book.publish_date && (
                <p className="text-gray-700 dark:text-maroon-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-bold inline-block w-20">Published:</span> {book.publish_date.slice(0, 4)}
                </p>
              )}
              {book.pages && (
                <p className="text-gray-700 dark:text-maroon-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-bold inline-block w-20">Pages:</span> {book.pages}
                </p>
              )}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-4 w-full">
            <div className="flex items-center border-l-4 border-rose-100 dark:border-maroon-accent pl-2">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-maroon-text font-serif italic tracking-wide mr-2">Rating:</h2>
              <span className="text-rose-600 dark:text-maroon-accent">
                {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
              </span> 
              <span className="ml-1 text-xs text-gray-500 dark:text-maroon-secondary">({book.rating}/5)</span>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-3">
            {/* Description divider similar to the Review divider */}
            <div className="relative flex items-center py-3">
              <div className="flex-grow border-t border-rose-100 dark:border-maroon-accent"></div>
              <span className="flex-shrink mx-3 text-gray-500 dark:text-maroon-secondary font-serif font-medium tracking-wide text-sm">Description</span>
              <div className="flex-grow border-t border-rose-100 dark:border-maroon-accent"></div>
            </div>
            <div className="p-3 italic text-gray-700 dark:text-maroon-text text-xs font-serif leading-relaxed">
              {book.description && book.description.length > 150 && !showFullDescription ? (
                <>
                  <p className="line-clamp-5">{book.description}</p>
                  <button 
                    onClick={() => setShowFullDescription(true)}
                    className="block text-blue-600 hover:underline text-xs font-medium mt-1 not-italic font-sans dark:text-maroon-accent"
                  >
                    View more
                  </button>
                </>
              ) : (
                <>
                  {book.description}
                  {book.description && book.description.length > 150 && (
                    <button 
                      onClick={() => setShowFullDescription(false)}
                      className="block text-blue-600 hover:underline text-xs font-medium mt-1 not-italic font-sans dark:text-maroon-accent"
                    >
                      View less
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Divider with Review in the middle */}
          <div className="relative flex items-center py-3">
            <div className="flex-grow border-t border-rose-100 dark:border-maroon-accent"></div>
            <span className="flex-shrink mx-3 text-gray-500 dark:text-maroon-secondary font-medium text-sm">Review</span>
            <div className="flex-grow border-t border-rose-100 dark:border-maroon-accent"></div>
          </div>
          
          <div className="review-text text-gray-700 dark:text-maroon-text mb-5 font-serif italic">
            <p>{book.review}</p>
          </div>
          
          {book.review_date && (
            <div className="text-center text-gray-500 dark:text-maroon-secondary italic text-xs mb-6">Date posted: {book.review_date}</div>
          )}
          {/* Book Links */}
          <div className="book-links flex justify-center gap-3 my-4">
            {book.goodreads_link && (
              <SmartLink to={book.goodreads_link} className="book-link bg-gray-200 dark:bg-maroon-card px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-accent hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Goodreads</SmartLink>
            )}
            {book.storygraph_link && (
              <SmartLink to={book.storygraph_link} className="book-link bg-gray-200 dark:bg-maroon-card px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-accent hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Storygraph</SmartLink>
            )}
            {book.bookshop_link && (
              <SmartLink to={book.bookshop_link} className="book-link bg-gray-200 dark:bg-maroon-card px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-accent hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Bookshop.org</SmartLink>
            )}
            {book.barnes_noble_link && (
              <SmartLink to={book.barnes_noble_link} className="book-link bg-gray-200 dark:bg-maroon-card px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-accent hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Barnes & Noble</SmartLink>
            )}
          </div>
          
          {/* Thank you note at the bottom of the column */}
          <div className="text-center text-gray-500 dark:text-maroon-secondary mt-auto pt-4 text-xs italic whitespace-nowrap overflow-hidden text-ellipsis border-t border-rose-50 dark:border-maroon-accent/30">
            Thanks to Netgalley & publisher for this ARC in exchange for honest review!
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showModal && book && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full p-1 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-maroon-card dark:scrollbar-track-gray-900">
            <h2 className="text-2xl font-semibold font-serif italic text-center bg-transparent dark:bg-gray-800 py-2 rounded-t-2xl">
              Edit Book Review
            </h2>
            <div className="h-1 w-24 bg-maroon-card rounded-full mx-auto mb-0"></div>
            <BookForm 
              initialData={book}
              onSubmit={handleBookSubmit} 
              onCancel={closeModal} 
              isSubmitting={isSubmitting} 
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete the review for <span className="font-semibold">{book.title}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 