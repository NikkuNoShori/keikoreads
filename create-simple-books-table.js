import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://dxnbvimslgqwyobfrrsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bmJ2aW1zbGdxd3lvYmZycnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTc2MTIsImV4cCI6MjA2MTc5MzYxMn0.KvFRUzBW1aGPU3CvgMjESIvaBUG13ng_7kOmxkyJ_Po';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample book data
const sampleBooks = [
  {
    title: 'Where Shadows Meet',
    author: 'Hannah Alexander',
    series: 'Shadows Series',
    genre: 'Mystery',
    publish_date: '2020-05-15',
    pages: 320,
    rating: 4,
    description: 'A gripping tale of love and redemption in a small town haunted by its dark past.',
    review: 'This book had me on the edge of my seat from start to finish. The author weaves a beautiful narrative about finding light in the darkest places. The characters are well-developed and relatable, making it easy to become invested in their journey.',
    review_date: '2023-06-10',
    cover_image: 'https://placehold.co/400x600/rose/white?text=Where+Shadows+Meet',
    goodreads_link: 'https://goodreads.com',
    storygraph_link: 'https://thestorygraph.com',
    bookshop_link: 'https://bookshop.org',
    barnes_noble_link: 'https://barnesandnoble.com'
  },
  {
    title: 'Death of the Author',
    author: 'J.L. Barthes',
    genre: 'Literary Fiction',
    publish_date: '2018-11-03',
    pages: 256,
    rating: 5,
    description: 'A meta-fictional exploration of creativity, legacy, and the relationship between writer and reader.',
    review: 'A masterpiece that challenges conventional storytelling. Barthes creates a labyrinthine narrative that constantly questions the nature of authorship and the meaning we derive from texts. The prose is exquisite, with layers upon layers of meaning waiting to be uncovered.',
    review_date: '2023-07-22',
    cover_image: 'https://placehold.co/400x600/navy/white?text=Death+of+the+Author',
    goodreads_link: 'https://goodreads.com',
    storygraph_link: 'https://thestorygraph.com'
  }
];

async function run() {
  console.log('Checking if books table exists...');
  
  try {
    // Try to select from the books table
    const { error: selectError } = await supabase
      .from('books')
      .select('*')
      .limit(1);
    
    if (selectError && selectError.code === '42P01') {
      console.log('Books table does not exist. You need to create it in the Supabase dashboard.');
      console.log('\nInstructions:');
      console.log('1. Go to https://app.supabase.com/');
      console.log('2. Sign in and open your project (dxnbvimslgqwyobfrrsx)');
      console.log('3. Go to the SQL Editor');
      console.log('4. Copy and paste the SQL below:');
      console.log('\n----------- SQL TO CREATE BOOKS TABLE -----------');
      console.log(`
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

-- Sample data
INSERT INTO books (title, author, rating, description, review, cover_image, genre, publish_date, pages, review_date)
VALUES 
  (
    'Where Shadows Meet', 
    'Hannah Alexander', 
    4, 
    'A gripping tale of love and redemption in a small town haunted by its dark past.', 
    'This book had me on the edge of my seat from start to finish. The author weaves a beautiful narrative about finding light in the darkest places.',
    'https://placehold.co/400x600/rose/white?text=Where+Shadows+Meet',
    'Mystery',
    '2020-05-15',
    320,
    '2023-06-10'
  ),
  (
    'Death of the Author', 
    'J.L. Barthes', 
    5, 
    'A meta-fictional exploration of creativity, legacy, and the relationship between writer and reader.', 
    'A masterpiece that challenges conventional storytelling. Barthes creates a labyrinthine narrative that constantly questions the nature of authorship.',
    'https://placehold.co/400x600/navy/white?text=Death+of+the+Author',
    'Literary Fiction',
    '2018-11-03',
    256,
    '2023-07-22'
  );
`);
      console.log('-------------------------------------------------');
      console.log('5. Run the SQL');
      console.log('6. After creating the table, refresh your app and it should work!');
    } else {
      console.log('Books table exists! Testing with sample data...');
      
      // Try to insert sample data
      const { data, error } = await supabase
        .from('books')
        .upsert(sampleBooks, { onConflict: 'title,author' })
        .select();
        
      if (error) {
        console.error('Error inserting sample data:', error);
      } else {
        console.log('Sample data inserted/updated successfully!');
        console.log(data);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run(); 