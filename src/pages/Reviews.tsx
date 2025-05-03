import { useState } from "react";
import { BookCard } from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";
import { BookFilters, BookSortField, SortDirection } from "../types/BookTypes";

export const Reviews = () => {
  // State for sorting and filtering
  const [sortField, setSortField] = useState<BookSortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFilters] = useState<BookFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Get books using our custom hook
  const {
    books,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    pageSize,
  } = useBooks(sortField, sortDirection, filters);

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
      <h1 className="text-4xl font-bold mb-4">Book Reviews</h1>
      
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
              className="px-4 py-2 bg-rose-600 text-white rounded-r hover:bg-rose-700"
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
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}; 