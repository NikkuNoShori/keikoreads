import { useState, useEffect, useCallback } from 'react';
import { BookSortField, SortDirection, BookFilters, Book } from '../types/BookTypes';
import * as bookService from '../utils/bookService';

interface UseBooksResult {
  books: Book[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  fetchBooks: (
    sortField?: BookSortField,
    sortDirection?: SortDirection,
    filters?: BookFilters,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

export const useBooks = (
  initialSortField: BookSortField = 'created_at',
  initialSortDirection: SortDirection = 'desc',
  initialFilters?: BookFilters,
  initialPage = 1,
  initialPageSize = 9
): UseBooksResult => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState<BookSortField>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [filters, setFilters] = useState<BookFilters | undefined>(initialFilters);

  const fetchBooks = useCallback(
    async (
      newSortField?: BookSortField,
      newSortDirection?: SortDirection,
      newFilters?: BookFilters,
      newPage?: number,
      newPageSize?: number
    ) => {
      // Update state with any new parameters
      if (newSortField) setSortField(newSortField);
      if (newSortDirection) setSortDirection(newSortDirection);
      if (newFilters) setFilters(newFilters);
      if (newPage !== undefined) setCurrentPage(newPage);
      if (newPageSize !== undefined) setPageSize(newPageSize);

      // Use either new values or current state values
      const sortFieldToUse = newSortField || sortField;
      const sortDirectionToUse = newSortDirection || sortDirection;
      const filtersToUse = newFilters || filters;
      const pageToUse = newPage !== undefined ? newPage : currentPage;
      const pageSizeToUse = newPageSize !== undefined ? newPageSize : pageSize;

      setLoading(true);
      try {
        const { data, count, error } = await bookService.getBooks(
          sortFieldToUse,
          sortDirectionToUse,
          filtersToUse,
          pageToUse,
          pageSizeToUse
        );

        if (error) {
          setError(error);
          setBooks([]);
        } else {
          setBooks(data || []);
          setTotalCount(count || 0);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setBooks([]);
      } finally {
        setLoading(false);
      }
    },
    [sortField, sortDirection, filters, currentPage, pageSize]
  );

  // Initial fetch
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    totalCount,
    fetchBooks,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  };
}; 