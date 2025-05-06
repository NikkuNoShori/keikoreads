import { supabase } from './supabaseClient';

/**
 * Generate an embedding for text using OpenAI's API
 * Note: You need to replace 'YOUR_OPENAI_API_KEY' with an actual API key
 * @param {string} text - The text to generate an embedding for
 * @returns {Promise<number[]>} - The embedding as an array of numbers
 */
export const generateEmbedding = async (text) => {
  try {
    // Get the OpenAI API key from environment variable
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing. Please set VITE_OPENAI_API_KEY in your .env file.');
    }
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });
    
    const { data, error } = await response.json();
    
    if (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    
    return data[0].embedding;
  } catch (err) {
    console.error('Error generating embedding:', err);
    throw err;
  }
};

/**
 * Generate and store an embedding for a book
 * @param {string} bookId - The ID of the book
 * @returns {Promise<void>}
 */
export const generateAndStoreBookEmbedding = async (bookId) => {
  try {
    // Get the book details
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('title, author, description, review, genre')
      .eq('id', bookId)
      .single();
    
    if (fetchError) {
      throw new Error(`Error fetching book: ${fetchError.message}`);
    }
    
    // Create a text representation of the book
    const bookText = `
      Title: ${book.title}
      Author: ${book.author}
      Genre: ${book.genre || ''}
      Description: ${book.description || ''}
      Review: ${book.review || ''}
    `;
    
    // Generate the embedding
    const embedding = await generateEmbedding(bookText);
    
    // Store the embedding in the database
    const { error: updateError } = await supabase
      .from('books')
      .update({ embedding })
      .eq('id', bookId);
    
    if (updateError) {
      throw new Error(`Error updating book embedding: ${updateError.message}`);
    }
    
    console.log(`Embedding generated and stored for book: ${book.title}`);
  } catch (err) {
    console.error('Error in generateAndStoreBookEmbedding:', err);
    throw err;
  }
};

/**
 * Find similar books to a given book
 * @param {string} bookId - The ID of the reference book
 * @param {number} count - The number of similar books to return
 * @returns {Promise<Array>} - Array of similar books
 */
export const findSimilarBooks = async (bookId, count = 5) => {
  try {
    const { data, error } = await supabase
      .rpc('find_similar_books', { book_id: bookId, match_count: count });
    
    if (error) {
      throw new Error(`Error finding similar books: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in findSimilarBooks:', err);
    throw err;
  }
};

/**
 * Search for books using a semantic query
 * @param {string} query - The search query
 * @param {number} threshold - Similarity threshold (0-1)
 * @param {number} count - Maximum number of results
 * @returns {Promise<Array>} - Array of matching books
 */
export const semanticSearchBooks = async (query, threshold = 0.7, count = 10) => {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    // Search the database using the embedding
    const { data, error } = await supabase
      .rpc('search_books_by_embedding', { 
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: count
      });
    
    if (error) {
      throw new Error(`Error performing semantic search: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in semanticSearchBooks:', err);
    throw err;
  }
}; 