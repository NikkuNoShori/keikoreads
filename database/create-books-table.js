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

async function createBooksTableAndInsertData() {
  console.log('Attempting to insert sample books...');
  
  try {
    const { data, error } = await supabase
      .from('books')
      .insert(sampleBooks)
      .select();
    
    if (error) {
      console.error('Error inserting books:', error);
      
      if (error.code === '42P01') { // relation does not exist
        console.log('The books table does not exist. Creating it now...');
        
        // We'll try to manually create the table with a simplified schema
        // Note: We can't create complex triggers or policies through the API
        try {
          // We need to use the REST API directly with a custom query
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/CREATE_BOOKS_TABLE`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
          
          if (!response.ok) {
            console.error('Failed to create table through RPC');
            console.log('Please create the books table manually in the Supabase dashboard');
            console.log('Schema SQL is available in schema.sql');
            
            console.log('\nInstructions:');
            console.log('1. Go to https://app.supabase.com/');
            console.log('2. Open your project');
            console.log('3. Go to SQL Editor');
            console.log('4. Copy and paste the contents of schema.sql');
            console.log('5. Run the SQL');
            console.log('\nAfter creating the table, try running this script again to insert sample data.');
          } else {
            console.log('Table created successfully! Trying to insert data again...');
            
            // Try inserting again
            const { error: insertError } = await supabase
              .from('books')
              .insert(sampleBooks);
              
            if (insertError) {
              console.error('Error inserting books after table creation:', insertError);
            } else {
              console.log('Sample books inserted successfully!');
            }
          }
        } catch (err) {
          console.error('Error creating table:', err);
        }
      }
    } else {
      console.log('Sample books inserted successfully!');
      console.log(data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createBooksTableAndInsertData(); 