-- Update cover image for Where Shadows Meet
-- Correcting the file extension to .jpg
UPDATE books
SET 
  cover_image = '/assets/whereShadowsMeet.jpg',
  updated_at = CURRENT_TIMESTAMP
WHERE title = 'Where Shadows Meet';

-- Confirm the update
SELECT title, cover_image FROM books WHERE title = 'Where Shadows Meet'; 