import { useState, useEffect } from "react";
import { BookCard } from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";
import { BookSortField, SortDirection, NewBook, Book } from "../types/BookTypes";
import { BookForm } from "../components/BookForm";
import { createBook, updateBook, deleteBook } from "../utils/bookService";
import { useNavigate } from 'react-router-dom';
import { AuthorizedAction } from "../components/AuthorizedAction";
import { supabase } from "../utils/supabaseClient";

export const Reviews = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<BookSortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  
  const navigate = useNavigate();
  
  // Get books using our custom hook
  const {
    books,
    loading,
    error,
    totalCount,
    fetchBooks,
    currentPage,
    setCurrentPage,
    pageSize,
  } = useBooks(sortField, sortDirection, { searchTerm });
  
  // Debug log to see what's happening
  useEffect(() => {
    console.log("Books status:", { 
      loading, 
      bookCount: books?.length || 0,
      totalCount,
      error: error?.message || 'none' 
    });
  }, [books, loading, error, totalCount]);
  
  // Update books when sort or filter changes - remove dependency on fetchBooks
  useEffect(() => {
    // Only initial render - further refreshes will be triggered by specific user actions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Toggle review selection
  const toggleBookSelection = (bookId: string) => {
    const newSelectedBooks = new Set(selectedBooks);
    if (newSelectedBooks.has(bookId)) {
      newSelectedBooks.delete(bookId);
    } else {
      newSelectedBooks.add(bookId);
    }
    setSelectedBooks(newSelectedBooks);
  };
  
  // Toggle select mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedBooks(new Set());
  };
  
  // Handle batch delete
  const handleBatchDelete = () => {
    if (selectedBooks.size === 0) return;
    setShowBatchDeleteConfirm(true);
  };
  
  // Confirm batch delete
  const confirmBatchDelete = async () => {
    if (selectedBooks.size === 0) return;
    
    try {
      const bookIds = Array.from(selectedBooks);
      
      // Delete each book one by one
      for (const id of bookIds) {
        const { error } = await supabase
          .from('books')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
      
      // Refresh the books list
      fetchBooks();
      setSelectMode(false);
      setSelectedBooks(new Set());
      setShowBatchDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting reviews:', error);
      alert('Error deleting reviews');
    }
  };
  
  // Handle sort changes
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // Value format is "field-direction"
    const [field, direction] = value.split('-') as [BookSortField, SortDirection];
    setSortField(field);
    setSortDirection(direction);
    // Fetch books with new sort parameters
    fetchBooks(field, direction, { searchTerm }, currentPage, pageSize);
  };

  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchBooks(sortField, sortDirection, { searchTerm }, 1, pageSize);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Handle new review submit
  const handleBookSubmit = async (bookData: NewBook) => {
    setIsSubmitting(true);
    try {
      if (editingBook) {
        // Update existing book
        const { data, error } = await updateBook(editingBook.id, bookData);
        if (!error && data) {
          await fetchBooks();
          closeModal();
          // If we're on the review page, navigate to refresh the data
          if (window.location.pathname === `/reviews/${data.id}`) {
            navigate(`/reviews/${data.id}`);
          }
        } else {
          alert(error?.message || 'Error updating review');
        }
      } else {
        // Create new book
        const { data, error } = await createBook(bookData);
        if (!error && data) {
          await fetchBooks();
          closeModal();
          // Redirect to the new review detail page
          navigate(`/reviews/${data.id}`);
        } else {
          alert(error?.message || 'Error creating review');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit book
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  // Handle delete book
  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  };

  // Confirm delete book
  const confirmDelete = async () => {
    if (!bookToDelete) return;
    
    const { error } = await deleteBook(bookToDelete.id);
    if (!error) {
      await fetchBooks();
      setShowDeleteConfirm(false);
      setBookToDelete(null);
    } else {
      alert(`Error deleting review: ${error.message}`);
    }
  };

  // Close all modals
  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setShowDeleteConfirm(false);
    setBookToDelete(null);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">Book Reviews</h1>
        <div className="flex space-x-2">
          <AuthorizedAction>
            <button
              onClick={toggleSelectMode}
              className={`px-4 py-2 rounded transition-colors ${
                selectMode 
                ? 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {selectMode ? 'Cancel' : 'Edit'}
            </button>
          </AuthorizedAction>
          
          {selectMode ? (
            <button
              onClick={handleBatchDelete}
              disabled={selectedBooks.size === 0}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete ({selectedBooks.size})
            </button>
          ) : (
            <AuthorizedAction>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
              >
                New Review
              </button>
            </AuthorizedAction>
          )}
        </div>
      </div>
      {/* Modal for New/Edit Review */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-3xl w-full p-6 px-0 my-12 relative max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-maroon-card dark:scrollbar-track-gray-900">
            <h2 className="text-2xl font-semibold font-serif italic text-center bg-transparent dark:bg-gray-800 py-1 rounded-t-2xl">
              {editingBook ? 'Edit Book Review' : 'New Book Review'}
            </h2>
            <div className="h-1 w-24 bg-maroon-card rounded-full mx-auto mb-1"></div>
            <BookForm 
              initialData={editingBook || undefined}
              onSubmit={handleBookSubmit} 
              onCancel={closeModal} 
              isSubmitting={isSubmitting} 
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete the review for <span className="font-semibold">{bookToDelete.title}</span>? 
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

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <form onSubmit={handleSearch} className="flex-grow relative">
          <div className="flex items-center relative rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-rose-500 dark:focus-within:ring-maroon-card transition-shadow">
            <div className="pl-3 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 border-0 focus:ring-0 focus:outline-none bg-white dark:bg-transparent dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white h-full hover:bg-rose-700 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              id="sort"
              value={`${sortField}-${sortDirection}`}
              onChange={handleSortChange}
              className="appearance-none pl-8 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 shadow-sm cursor-pointer"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="author-asc">Author (A-Z)</option>
              <option value="author-desc">Author (Z-A)</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
            </select>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Loading, Error and Count States */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-6 dark:bg-red-900 dark:text-red-200">
          <p>Error loading reviews: {error.toString()}</p>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No reviews found.</p>
          <AuthorizedAction>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
            >
              Add the First Review
            </button>
          </AuthorizedAction>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Found {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((book) => (
              <div key={book.id} className="w-full max-w-[180px] mx-auto">
                <BookCard 
                  book={book} 
                  onEdit={() => handleEditBook(book)}
                  onDelete={() => handleDeleteBook(book)}
                  selectMode={selectMode}
                  isSelected={selectedBooks.has(book.id)}
                  onToggleSelect={toggleBookSelection}
                />
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}

      {/* Batch Delete Confirmation Modal */}
      {showBatchDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete {selectedBooks.size} {selectedBooks.size === 1 ? 'review' : 'reviews'}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBatchDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmBatchDelete}
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