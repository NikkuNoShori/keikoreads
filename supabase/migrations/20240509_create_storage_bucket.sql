CREATE STORAGE BUCKET IF NOT EXISTS book_covers; UPDATE storage.buckets SET public = true WHERE id = 'book_covers';
