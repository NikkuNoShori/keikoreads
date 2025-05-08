-- 1. Add slug column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='books' AND column_name='slug'
  ) THEN
    ALTER TABLE books ADD COLUMN slug text;
  END IF;
END$$;

-- 2. Populate slug column for all books (overwrite to ensure consistency)
UPDATE books SET slug = lower(regexp_replace(title, '[^a-z0-9]+', '-', 'g'));

-- 3. Set slug column as NOT NULL if not already
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='books' AND column_name='slug' AND is_nullable='YES'
  ) THEN
    ALTER TABLE books ALTER COLUMN slug SET NOT NULL;
  END IF;
END$$;

-- 4. Add unique index on slug if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename='books' AND indexname='books_slug_idx'
  ) THEN
    CREATE UNIQUE INDEX books_slug_idx ON books(slug);
  END IF;
END$$;