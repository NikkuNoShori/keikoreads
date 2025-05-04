import { useState } from "react";
import { BookCard } from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";
import { BookFilters, BookSortField, SortDirection, NewBook, Book } from "../types/BookTypes";
import { BookForm } from "../components/BookForm";
import { createBook, updateBook, deleteBook } from "../utils/bookService";
import { useNavigate } from 'react-router-dom';

export const Reviews = () => {
  // State for sorting and filtering
  const [sortField, setSortField] = useState<BookSortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFilters] = useState<BookFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

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
  } = useBooks(sortField, sortDirection, filters);

  const navigate = useNavigate();

  // Handle sort changes
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // Value format is "field-direction"
    const [field, direction] = value.split('-') as [BookSortField, SortDirection];
    setSortField(field);
    setSortDirection(direction);
  };

  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters({ ...filters, searchTerm });
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
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
        >
          New Review
        </button>
      </div>
      {/* Modal for New/Edit Review */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full p-1 relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-maroon-card dark:scrollbar-track-gray-900">
            <h2 className="text-2xl font-semibold font-serif italic text-center bg-transparent dark:bg-gray-800 py-2 rounded-t-2xl">
              {editingBook ? 'Edit Book Review' : 'New Book Review'}
            </h2>
            <div className="h-1 w-24 bg-maroon-card rounded-full mx-auto mb-0"></div>
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
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="flex">
            <input
              type="text"
              placeholder="Search by title, author, or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l dark:bg-gray-800"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white rounded-r hover:bg-rose-700 dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            id="sort"
            value={`${sortField}-${sortDirection}`}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
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
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          <p className="font-semibold">Error loading reviews:</p>
          <p>{error.message}</p>
        </div>
      )}
      {!loading && !error && books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No reviews found. Try adjusting your search or filters.</p>
        </div>
      )}
      {!loading && !error && books.length > 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Showing {books.length} of {totalCount} reviews
        </p>
      )}
      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        ))}
      </div>
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}; 