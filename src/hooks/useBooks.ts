import { useState, useEffect, useCallback, useRef } from "react";
import {
  BookSortField,
  SortDirection,
  BookFilters,
  Book,
} from "../types/BookTypes";
import * as bookService from "../utils/bookService";

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
  initialSortField: BookSortField = "created_at",
  initialSortDirection: SortDirection = "desc",
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

  // Use refs to track if data is already loaded and avoid unnecessary refetches
  const initialLoadCompleted = useRef(false);
  // Track last fetch parameters to avoid duplicate requests
  const lastFetchParams = useRef({
    sortField: initialSortField,
    sortDirection: initialSortDirection,
    filters: initialFilters,
    page: initialPage,
    pageSize: initialPageSize,
  });

  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchBooks = useCallback(
    async (
      sortFieldToUse: BookSortField = initialSortField,
      sortDirectionToUse: SortDirection = initialSortDirection,
      filtersToUse: BookFilters | undefined = initialFilters,
      pageToUse: number = currentPage,
      pageSizeToUse: number = pageSize
    ) => {
      // Clear any existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Check if the parameters are the same as the last fetch to avoid duplicate requests
      const currentParams = {
        sortField: sortFieldToUse,
        sortDirection: sortDirectionToUse,
        filters: filtersToUse,
        page: pageToUse,
        pageSize: pageSizeToUse,
      };

      const paramsChanged =
        lastFetchParams.current.sortField !== currentParams.sortField ||
        lastFetchParams.current.sortDirection !== currentParams.sortDirection ||
        lastFetchParams.current.page !== currentParams.page ||
        lastFetchParams.current.pageSize !== currentParams.pageSize ||
        JSON.stringify(lastFetchParams.current.filters) !==
          JSON.stringify(currentParams.filters);

      // If parameters haven't changed and we've already loaded data, don't fetch again
      if (!paramsChanged && initialLoadCompleted.current && books.length > 0) {
        return;
      }

      // Update last fetch params
      lastFetchParams.current = currentParams;

      // Debounce the actual fetch call to prevent rapid consecutive requests
      debounceTimer.current = setTimeout(async () => {
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
            initialLoadCompleted.current = true;
          }
        } catch (err) {
          setError(
            err instanceof Error ? err : new Error("An unknown error occurred")
          );
          setBooks([]);
        } finally {
          setLoading(false);
        }
      }, 100); // 100ms debounce delay
    },
    [
      currentPage,
      pageSize,
      initialSortField,
      initialSortDirection,
      initialFilters,
      books.length,
    ]
  );

  // Initial fetch only on mount
  useEffect(() => {
    fetchBooks();

    // Set up visibility change listener to prevent unnecessary fetches when tab regains focus
    const handleVisibilityChange = () => {
      // Only fetch if the page becomes visible AND we haven't loaded data yet
      if (
        document.visibilityState === "visible" &&
        !initialLoadCompleted.current
      ) {
        fetchBooks();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
