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
        query = query.or(`title.ilike.%${filters.searchTerm}%,author.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
    }

    // Apply sorting
    query = query.order(sortField, { ascending: sortDirection === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;

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

// Create a new book
export const createBook = async (book: NewBook): Promise<{ data: Book | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert(book)
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
export const updateBook = async (id: string, book: Partial<Book>): Promise<{ data: Book | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(book)
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