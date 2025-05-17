import { supabase } from './supabaseClient';
import { Book, NewBook, BookSortField, SortDirection, BookFilters } from '../types/BookTypes';

// Fetch all books with optional sorting and filtering
export const getBooks = async (
  sortField: BookSortField = 'created_at',
  sortDirection: SortDirection = 'desc',
  filters?: BookFilters,
  page = 1,
  pageSize = 10
): Promise<{ data: Book[] | null; count: number | null; error: Error | null }> => {
  try {
    console.log('[bookService] getBooks called with:', { sortField, sortDirection, filters, page, pageSize });
    // Start building the query
    let query = supabase
      .from('books')
      .select('*', { count: 'exact' });

    // Apply filters if provided
    if (filters) {
      if (filters.genre) {
        query = query.eq('genre', filters.genre);
      }
      if (filters.author) {
        query = query.eq('author', filters.author);
      }
      if (filters.rating) {
        query = query.eq('rating', filters.rating);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,author.ilike.%${filters.searchTerm}%,review_date.ilike.%${filters.searchTerm}%,publish_date.ilike.%${filters.searchTerm}%`);
      }
      if (typeof filters.deleted === 'boolean') {
        query = query.eq('deleted', filters.deleted);
      }
    }

    // If sorting by review_date, fetch all, sort in JS, then paginate
    if (sortField === 'review_date') {
      // Remove pagination for now, will apply after sorting
      const { data, error, count } = await query;
      console.log('[bookService] Supabase response (review_date):', { data, error, count });
      if (error) return { data: null, count: null, error: new Error(error.message) };
      if (!data) return { data: [], count: 0, error: null };
      // Sort by year, then month, then day
      const sorted = data.sort((a, b) => {
        if (!a.review_date && !b.review_date) return 0;
        if (!a.review_date) return sortDirection === 'asc' ? -1 : 1;
        if (!b.review_date) return sortDirection === 'asc' ? 1 : -1;
        const [aYear, aMonth, aDay] = a.review_date.split('-').map(Number);
        const [bYear, bMonth, bDay] = b.review_date.split('-').map(Number);
        if (aYear !== bYear) return sortDirection === 'asc' ? aYear - bYear : bYear - aYear;
        if (aMonth !== bMonth) return sortDirection === 'asc' ? aMonth - bMonth : bMonth - aMonth;
        return sortDirection === 'asc' ? aDay - bDay : bDay - aDay;
      });
      // Paginate
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      return { data: sorted.slice(from, to), count: count || sorted.length, error: null };
    }

    // Apply sorting for other fields
    query = query.order(sortField, { ascending: sortDirection === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;
    console.log('[bookService] Supabase response:', { data, error, count });

    return { data, count, error: error ? new Error(error.message) : null };
  } catch (error) {
    console.error('Error fetching books:', error);
    return { data: null, count: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Get a single book by ID
export const getBookById = async (id: string): Promise<{ data: Book | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    return { 
      data, 
      error: error ? new Error(error.message) : null 
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
};

// Generate a URL-friendly slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 200); // Limit length
};

// Create a new book
export const createBook = async (book: NewBook): Promise<{ data: Book | null; error: Error | null }> => {
  try {
    // Generate slug from title
    const slug = generateSlug(book.title);

    // Convert empty date strings to null
    const cleanBook = {
      ...book,
      publish_date: book.publish_date ? book.publish_date : null,
      review_date: book.review_date ? book.review_date : null,
      deleted: false, // Always set to false for new books
    };

    const { data, error } = await supabase
      .from('books')
      .insert({ ...cleanBook, slug })
      .select()
      .single();

    return { 
      data, 
      error: error ? new Error(error.message) : null 
    };
  } catch (error) {
    console.error('Error creating book:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
};

// Update an existing book
export const updateBook = async (id: string, book: NewBook): Promise<{ data: Book | null; error: Error | null }> => {
  try {
    let title = book.title;
    // If title is not provided, fetch the current book to get the title
    if (!title) {
      const { data: currentBook, error: fetchError } = await supabase
        .from('books')
        .select('title')
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;
      title = currentBook?.title;
    }
    // Only generate slug if title is available
    const slug = title ? generateSlug(title) : undefined;

    const { data, error } = await supabase
      .from('books')
      .update({ ...book, slug, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { 
      data, 
      error: error ? new Error(error.message) : null 
    };
  } catch (error) {
    console.error('Error updating book:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
};

// Delete a book
export const deleteBook = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    return { error: error ? new Error(error.message) : null };
  } catch (error) {
    console.error('Error deleting book:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Get unique genres for filtering
export const getUniqueGenres = async (): Promise<{ data: string[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('genre')
      .not('genre', 'is', null);

    if (error) {
      throw new Error(error.message);
    }

    // Extract unique genres
    const genres = [...new Set(data.map(item => item.genre))];
    return { data: genres, error: null };
  } catch (error) {
    console.error('Error fetching genres:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Get unique authors for filtering
export const getUniqueAuthors = async (): Promise<{ data: string[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('author')
      .not('author', 'is', null);

    if (error) {
      throw new Error(error.message);
    }

    // Extract unique authors
    const authors = [...new Set(data.map(item => item.author))];
    return { data: authors, error: null };
  } catch (error) {
    console.error('Error fetching authors:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Fetch a book by slug
export const getBookBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .single();
  return { data, error };
}; 