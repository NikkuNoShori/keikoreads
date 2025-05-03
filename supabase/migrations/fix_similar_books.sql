-- Fix the find_similar_books function with a different syntax
DROP FUNCTION IF EXISTS find_similar_books;

CREATE FUNCTION find_similar_books(
  book_id UUID,
  match_count integer DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  genre TEXT,
  similarity float
)
AS $$
  SELECT
    b.id,
    b.title,
    b.author,
    b.genre,
    1 - (b.embedding <=> o.embedding) as similarity
  FROM books b, books o
  WHERE o.id = book_id
    AND b.id <> o.id
    AND o.embedding IS NOT NULL
    AND b.embedding IS NOT NULL
  ORDER BY b.embedding <=> o.embedding
  LIMIT match_count;
$$ LANGUAGE SQL; 