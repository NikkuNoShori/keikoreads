import { useState, useEffect, useCallback } from 'react';
import { BookSortField, SortDirection, BookFilters, Book } from '../types/BookTypes';
import * as bookService from '../utils/bookService';

export interface UseBooksResult {
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
  const [sortField] = useState<BookSortField>(initialSortField);
  const [sortDirection] = useState<SortDirection>(initialSortDirection);
  const [filters] = useState<BookFilters | undefined>(initialFilters);

  const fetchBooks = useCallback(
    async (
      sortFieldToUse: BookSortField = sortField,
      sortDirectionToUse: SortDirection = sortDirection,
      filtersToUse: BookFilters | undefined = filters,
      pageToUse: number = currentPage,
      pageSizeToUse: number = pageSize
    ) => {
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
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
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