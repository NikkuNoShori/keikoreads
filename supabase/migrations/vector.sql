-- Enable the pgvector extension to work with vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add a vector column to the books table for storing embeddings
ALTER TABLE books ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create an index for efficient similarity search
CREATE INDEX IF NOT EXISTS books_embedding_idx ON books USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create a function to search books by similarity to an embedding vector
CREATE OR REPLACE FUNCTION search_books_by_embedding(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  genre TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    books.id,
    books.title,
    books.author,
    books.genre,
    1 - (books.embedding <=> query_embedding) as similarity
  FROM books
  WHERE 1 - (books.embedding <=> query_embedding) > match_threshold
  ORDER BY books.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create a function to find similar books based on an existing book ID
CREATE OR REPLACE FUNCTION find_similar_books(
  book_id UUID,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  genre TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    similar.id,
    similar.title,
    similar.author,
    similar.genre,
    1 - (similar.embedding <=> origin.embedding) as similarity
  FROM books similar, books origin
  WHERE origin.id = book_id
    AND similar.id != origin.id
    AND origin.embedding IS NOT NULL
    AND similar.embedding IS NOT NULL
  ORDER BY similar.embedding <=> origin.embedding
  LIMIT match_count;
END;
$$; 