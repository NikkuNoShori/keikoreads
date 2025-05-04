-- Allow anonymous users to insert new books
CREATE POLICY "allow_anonymous_insert_books" ON books
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to update books
CREATE POLICY "allow_anonymous_update_books" ON books
  FOR UPDATE USING (true);

-- Allow anonymous users to delete books
CREATE POLICY "allow_anonymous_delete_books" ON books
  FOR DELETE USING (true);