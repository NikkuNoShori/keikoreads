-- Add book title to book_details and update author for Where Shadows Meet
-- Migration file: 20250504_update_book_details.sql

-- First, verify if the book_details column exists in the books table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'books' AND column_name = 'book_details'
  ) THEN
    -- Add the book_details column if it doesn't exist
    ALTER TABLE books ADD COLUMN book_details JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Update all existing books to include title in book_details
UPDATE books
SET book_details = jsonb_build_object(
  'title', title
)
WHERE book_details IS NULL OR NOT book_details ? 'title';

-- Update the author for Where Shadows Meet book
UPDATE books
SET author = 'Patrice Caldwell'
WHERE title = 'Where Shadows Meet';

-- Add a comment to explain the purpose of this migration
COMMENT ON TABLE books IS 'Books table with book details and metadata'; 