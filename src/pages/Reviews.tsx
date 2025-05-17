import { useState, useEffect, useRef } from "react";
import { BookCard } from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";
import { BookSortField, SortDirection, Book, NewBook } from "../types/BookTypes";
import { FiEdit2, FiPlusCircle, FiX } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { Modal } from "../components/Modal";
import { BookForm } from "../components/BookForm";
import { createBook, updateBook } from "../utils/bookService";
import { AuthorizedAction } from '../components/AuthorizedAction';

export const Reviews = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<BookSortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleteMode, setDeleteMode] = useState<'single' | 'batch'>('batch');
  const [singleDeleteBookId, setSingleDeleteBookId] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuthContext();
  
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
    setPageSize,
  } = useBooks(sortField, sortDirection, { searchTerm });
  
  // Add state for results per page dropdown
  const resultsPerPageOptions = [9, 28, 54, 96, 'All'];
  const [resultsPerPage, setResultsPerPage] = useState<number | 'All'>(pageSize);
  
  // Filtered suggestions based on searchTerm
  const suggestions = searchTerm.length > 0
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
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
  
  // Handle sort changes
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // Value format is "field-direction"
    const [field, direction] = value.split('-') as [BookSortField, SortDirection];
    setSortField(field);
    setSortDirection(direction);
    // Fetch books with new sort parameters
    fetchBooks(field, direction, searchTerm ? { searchTerm } : {}, currentPage, pageSize);
  };

  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, 1, pageSize);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    fetchBooks(sortField, sortDirection, suggestion ? { searchTerm: suggestion } : {}, 1, pageSize);
    setCurrentPage(1);
    if (inputRef.current) inputRef.current.blur();
  };

  // Handle edit book
  const handleEdit = (book: Book) => {
    console.log('Editing book:', book.title, book);
    setEditingBook(book);
    setShowModal(true);
  };

  // Handle delete book (single)
  const handleDelete = (book: Book) => {
    console.log('Deleting book:', book.title);
    setDeleteMode('single');
    setSingleDeleteBookId(book.id);
    setShowBatchDeleteConfirm(true);
  };

  // Handle batch delete (multi-select)
  const handleBatchDeleteClick = () => {
    setDeleteMode('batch');
    setShowBatchDeleteConfirm(true);
  };

  // Handle form submission
  const handleSubmit = async (bookData: NewBook) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting book data:', bookData);
      let bookToSubmit = { ...bookData };
      // If sorting by review_date and review_date is not set, set it to today
      if ((sortField === 'review_date' || !bookToSubmit.review_date) && !bookToSubmit.review_date) {
        bookToSubmit.review_date = new Date().toISOString().split('T')[0];
      }
      if (editingBook) {
        // Update existing book
        console.log('Updating existing book:', editingBook.id);
        const { data, error } = await updateBook(editingBook.id, bookToSubmit);
        console.log('Update response:', { data, error });
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');
      } else {
        // Create new book
        console.log('Creating new book');
        const { data, error } = await createBook(bookToSubmit);
        console.log('Create response:', { data, error });
        if (error) throw error;
        if (!data) throw new Error('No data returned from create');
      }
      // Refresh the books list and close modal
      console.log('Refreshing books list with params:', {
        sortField,
        sortDirection,
        searchTerm,
        currentPage,
        pageSize
      });
      await fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, 1, pageSize);
      setShowModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error submitting book:', err);
      alert('Failed to save book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close all modals
  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setShowBatchDeleteConfirm(false);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle results per page change
  const handleResultsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let newSize: number | 'All';
    if (value === 'All') {
      newSize = 'All';
      setPageSize(totalCount > 0 ? totalCount : 10000); // fallback large number if totalCount is 0
      fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, 1, totalCount > 0 ? totalCount : 10000);
    } else {
      newSize = parseInt(value, 10);
      setPageSize(newSize);
      fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, 1, newSize);
    }
    setResultsPerPage(newSize);
    setCurrentPage(1);
  };

  // Helper to handle page change and fetch books
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, newPage, pageSize);
  };

  // Handle book card click in select mode
  const handleBookCardClick = (book: Book) => {
    if (!selectMode) return;
    setSelectedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(book.id)) {
        newSet.delete(book.id);
      } else {
        newSet.add(book.id);
      }
      return newSet;
    });
  };

  // Handle batch soft delete (move to trash)
  const handleBatchSoftDelete = async () => {
    if (selectedBooks.size === 0) {
      alert('No books selected for deletion.');
      return;
    }
    try {
      const bookIds = Array.from(selectedBooks);
      const now = new Date().toISOString();
      console.log('Attempting to soft delete books:', bookIds);
      for (const id of bookIds) {
        const { error } = await supabase
          .from('books')
          .update({ deleted: true, deleted_at: now })
          .eq('id', id);
        console.log('Soft delete response for', id, error);
        if (error) throw error;
      }
      await fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, currentPage, pageSize);
      setSelectMode(false);
      setSelectedBooks(new Set());
      window.dispatchEvent(new Event('refreshRecyclingBin'));
      console.log('Soft delete complete, books refreshed.');
    } catch (error) {
      console.error('Error moving reviews to trash:', error);
      alert('Error moving reviews to trash');
    }
  };

  // Single soft delete handler
  const handleSingleSoftDelete = async () => {
    if (!singleDeleteBookId) return;
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('books')
        .update({ deleted: true, deleted_at: now })
        .eq('id', singleDeleteBookId);
      if (error) throw error;
      await fetchBooks(sortField, sortDirection, searchTerm ? { searchTerm } : {}, currentPage, pageSize);
      setSingleDeleteBookId(null);
      setShowBatchDeleteConfirm(false);
      window.dispatchEvent(new Event('refreshRecyclingBin'));
      console.log('Single soft delete complete, book refreshed.');
    } catch (error) {
      console.error('Error moving review to trash:', error);
      alert('Error moving review to trash');
    }
  };

  return (
    <div className="w-full">
      {/* Centered, elegant title */}
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-5xl text-center mb-2" style={{ fontFamily: "'Allura', cursive" }}>Book Reviews</h1>
      </div>
      {/* Search, filter, and actions row */}
      <div className="mb-6 w-full flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Sort (filter) selector on the left */}
        <div className="flex items-center space-x-2 order-1">
          <div className="relative">
            <select
              id="sort"
              value={`${sortField}-${sortDirection}`}
              onChange={handleSortChange}
              className="text-sm rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 pr-6 py-2 focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent transition cursor-pointer outline-none shadow-sm min-h-[44px] w-auto max-w-xs"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
            >
              <option value="review_date-desc">Newest First</option>
              <option value="review_date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="author-asc">Author (A-Z)</option>
              <option value="author-desc">Author (Z-A)</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
        {/* Search bar in the middle, stretches to fill */}
        <form onSubmit={handleSearch} className="flex-grow order-2 relative">
          <div className="flex items-center relative rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-rose-300 dark:focus-within:ring-maroon-accent transition min-h-[44px]">
            <span className="pl-2 text-gray-400 dark:text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 19l-4-4m0 0A7 7 0 1 0 5 5a7 7 0 0 0 10 10z" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by title, author, or description"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              className="flex-grow text-sm px-3 py-2 bg-transparent border-0 focus:ring-0 focus:outline-none dark:text-white rounded-full"
              autoComplete="off"
            />
            <button
              type="submit"
              className="text-sm rounded-full px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent transition ml-2 mr-2"
            >
              Search
            </button>
          </div>
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.slice(0, 8).map((book) => (
                <li
                  key={book.id}
                  className="px-4 py-2 cursor-pointer hover:bg-rose-50 dark:hover:bg-maroon-accent/30 text-left"
                  onMouseDown={() => handleSuggestionClick(book.title)}
                >
                  <span className="font-semibold">{book.title}</span>
                  {book.author && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">by {book.author}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </form>
        {/* Edit/New Review Buttons on the right */}
        <AuthorizedAction>
        <div className="flex items-center space-x-2 order-3">
          <button
            onClick={e => {
              e.stopPropagation();
              setSelectMode(!selectMode);
              setSelectedBooks(new Set());
            }}
            className={`p-2 rounded-full transition-colors ${
              selectMode
                ? 'bg-rose-100 dark:bg-maroon-accent'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent`}
            aria-label={selectMode ? 'Cancel' : 'Edit'}
            title={selectMode ? 'Cancel' : 'Edit'}
          >
            {selectMode ? (
              <FiX className="w-6 h-6 text-rose-600 dark:text-maroon-card" />
            ) : (
              <FiEdit2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          {selectMode ? (
            <button
              onClick={e => {
                e.stopPropagation();
                handleBatchDeleteClick();
              }}
              className="p-2 rounded-full transition-colors bg-red-100 dark:bg-red-700 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
              aria-label="Move to Trash"
              title="Move to Trash"
              disabled={selectedBooks.size === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </button>
          ) : (
            <button
              onClick={e => {
                e.stopPropagation();
                setShowModal(true);
                setEditingBook(null);
              }}
              className="p-2 rounded-full transition-colors hover:bg-rose-100 dark:hover:bg-maroon-accent focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent"
              aria-label="New Review"
              title="New Review"
            >
              <FiPlusCircle className="w-7 h-7 text-rose-600 dark:text-maroon-card" />
            </button>
          )}
        </div>
        </AuthorizedAction>
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
          {isAuthenticated && (
            <button
              onClick={() => {
                setShowModal(true);
                setEditingBook(null);
              }}
              className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
            >
              Add the First Review
            </button>
          )}
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Found {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm p-2">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectMode={selectMode}
                selected={selectedBooks.has(book.id)}
                onCardClick={handleBookCardClick}
              />
            ))}
          </div>
          {/* Unified, centered pagination and results-per-page control */}
          <div className="flex flex-col items-center mt-8">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm">
              {/* Previous button */}
              {resultsPerPage !== 'All' && (
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-1.5 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition hover:bg-rose-100 dark:hover:bg-maroon-accent focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}
              {/* Results per page dropdown */}
              <select
                id="results-per-page"
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
                className="text-xs px-2 py-1 bg-white text-gray-800 border-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent rounded-full cursor-pointer outline-none transition"
                style={{ colorScheme: 'light' }}
              >
                {resultsPerPageOptions.map((option) => (
                  <option key={option} value={option}>{option === 'All' ? 'All' : option}</option>
                ))}
              </select>
              {/* Next button */}
              {resultsPerPage !== 'All' && (
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-1.5 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition hover:bg-rose-100 dark:hover:bg-maroon-accent focus:ring-2 focus:ring-rose-300 dark:focus:ring-maroon-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
            {/* Page indicator below pagination */}
            {resultsPerPage !== 'All' && (
              <div className="w-full flex justify-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Batch Delete Confirmation Modal */}
      {showBatchDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="mb-4">
              {deleteMode === 'single'
                ? 'Are you sure you want to delete this review? This action cannot be undone.'
                : `Are you sure you want to delete ${selectedBooks.size} ${selectedBooks.size === 1 ? 'review' : 'reviews'}? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBatchDeleteConfirm(false);
                  setSingleDeleteBookId(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteMode === 'single' ? handleSingleSoftDelete : handleBatchSoftDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/New Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingBook ? "Edit Book Review" : "New Book Review"}
      >
        <BookForm
          initialData={editingBook || undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}; 