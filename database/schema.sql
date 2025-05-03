-- Create books table with expanded metadata
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  series TEXT,
  genre TEXT,
  publish_date DATE,
  pages INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  description TEXT,
  review TEXT,
  review_date DATE DEFAULT CURRENT_DATE,
  cover_image TEXT,
  goodreads_link TEXT,
  storygraph_link TEXT,
  bookshop_link TEXT,
  barnes_noble_link TEXT,
  read_alikes_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read books (but only admin can edit)
CREATE POLICY "Allow anonymous read access" ON books
  FOR SELECT USING (true);

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Sample data (uncomment and run after creating the table)
/*
INSERT INTO books (title, author, rating, description, review, cover_image)
VALUES 
  (
    'Where Shadows Meet', 
    'Hannah Alexander', 
    4, 
    'A gripping tale of love and redemption in a small town haunted by its dark past.', 
    'This book had me on the edge of my seat from start to finish. The author weaves a beautiful narrative about finding light in the darkest places. The characters are well-developed and relatable, making it easy to become invested in their journey. While some of the plot twists were predictable, the emotional impact was powerful nonetheless.',
    'https://example.com/cover1.jpg'
  ),
  (
    'Death of the Author', 
    'J.L. Barthes', 
    5, 
    'A meta-fictional exploration of creativity, legacy, and the relationship between writer and reader.', 
    'A masterpiece that challenges conventional storytelling. Barthes creates a labyrinthine narrative that constantly questions the nature of authorship and the meaning we derive from texts. The prose is exquisite, with layers upon layers of meaning waiting to be uncovered. This is the kind of book that rewards multiple readings and leaves you pondering its ideas long after the final page.',
    'https://example.com/cover2.jpg'
  );
*/ 