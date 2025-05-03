-- Add random vector embeddings to all books without embeddings
UPDATE books 
SET embedding = (
  SELECT 
    array_agg(random())::vector(1536)
  FROM 
    generate_series(1, 1536)
)
WHERE 
  embedding IS NULL; 