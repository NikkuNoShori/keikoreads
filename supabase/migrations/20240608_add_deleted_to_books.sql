-- Add soft delete columns to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS deleted boolean DEFAULT false;
ALTER TABLE books ADD COLUMN IF NOT EXISTS deleted_at timestamptz; 