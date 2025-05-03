import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Book } from '../types/BookTypes';
import { SmartLink } from '../components/SmartLink';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !book) return <div className="text-center py-10 text-red-600">{error || 'Book not found.'}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-maroon-container shadow-lg rounded-lg overflow-hidden mt-8">
      <div className="flex flex-col md:flex-row gap-8 p-8">
        {/* Book Info Sidebar */}
        <aside className="book-info flex-shrink-0 w-full md:w-64">
          <img src={book.cover_image || '/assets/book-placeholder.jpg'} alt="Book Cover" className="book-cover w-full rounded-lg shadow mb-6 bg-white dark:bg-gray-800" />
          <div className="book-details bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-maroon-text">Book Details</h2>
            <p className="text-gray-700 dark:text-maroon-text"><span className="font-bold">Author:</span> {book.author}</p>
            {book.series && <p className="text-gray-700 dark:text-maroon-text"><span className="font-bold">Series:</span> {book.series}</p>}
            {book.genre && <p className="text-gray-700 dark:text-maroon-text"><span className="font-bold">Genre:</span> {book.genre}</p>}
            {book.publish_date && <p className="text-gray-700 dark:text-maroon-text"><span className="font-bold">Published:</span> {book.publish_date.slice(0, 4)}</p>}
            {book.pages && <p className="text-gray-700 dark:text-maroon-text"><span className="font-bold">Pages:</span> {book.pages}</p>}
          </div>
          <div className="rating bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center mb-4">
            <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-maroon-text">Rating</h3>
            <div className="text-rose-600 text-xl mb-1">
              {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
            </div>
            <p className="text-gray-700 dark:text-maroon-text">{book.rating} out of 5</p>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          <div className="book-description bg-rose-50 dark:bg-gray-900 p-6 rounded-lg mb-6 italic text-gray-700 dark:text-maroon-text">
            {book.description}
          </div>
          <hr className="border-t-2 border-rose-100 dark:border-gray-700 my-6" />
          <div className="text-center text-gray-500 dark:text-maroon-text mb-4 text-sm italic">Thank you to Netgalley and the publisher for providing this ARC in exchange for an honest review!</div>
          <div className="review-text text-gray-700 dark:text-maroon-text mb-6">
            <p>{book.review}</p>
          </div>
          {book.review_date && (
            <div className="text-center text-gray-500 dark:text-maroon-text italic text-xs mb-6">Date posted: {book.review_date}</div>
          )}
          {/* Book Links */}
          <div className="book-links flex justify-center gap-3 my-4">
            {book.goodreads_link && (
              <SmartLink to={book.goodreads_link} className="book-link bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-text hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Goodreads</SmartLink>
            )}
            {book.storygraph_link && (
              <SmartLink to={book.storygraph_link} className="book-link bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-text hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Storygraph</SmartLink>
            )}
            {book.bookshop_link && (
              <SmartLink to={book.bookshop_link} className="book-link bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-text hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Bookshop.org</SmartLink>
            )}
            {book.barnes_noble_link && (
              <SmartLink to={book.barnes_noble_link} className="book-link bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-xs font-semibold hover:bg-rose-100 dark:hover:bg-maroon-text hover:text-gray-900 dark:hover:text-gray-900 transition-colors">Barnes & Noble</SmartLink>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}; 