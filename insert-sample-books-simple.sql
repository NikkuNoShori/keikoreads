-- First clear any existing data
DELETE FROM books;

-- Sample data without embeddings
INSERT INTO books (
  title, 
  author, 
  series, 
  genre, 
  publish_date, 
  pages, 
  rating, 
  description, 
  review, 
  review_date, 
  cover_image, 
  goodreads_link, 
  storygraph_link
) VALUES 
  (
    'Where Shadows Meet', 
    'Hannah Alexander', 
    'Shadows Series',
    'Mystery', 
    '2020-05-15', 
    320, 
    4, 
    'A gripping tale of love and redemption in a small town haunted by its dark past.', 
    'This book had me on the edge of my seat from start to finish. The author weaves a beautiful narrative about finding light in the darkest places.',
    '2023-06-10',
    'https://placehold.co/400x600/rose/white?text=Where+Shadows+Meet',
    'https://goodreads.com',
    'https://thestorygraph.com'
  ),
  (
    'Death of the Author', 
    'J.L. Barthes', 
    NULL,
    'Literary Fiction', 
    '2018-11-03', 
    256, 
    5, 
    'A meta-fictional exploration of creativity, legacy, and the relationship between writer and reader.', 
    'A masterpiece that challenges conventional storytelling. Barthes creates a labyrinthine narrative that constantly questions the nature of authorship.',
    '2023-07-22',
    'https://placehold.co/400x600/navy/white?text=Death+of+the+Author',
    'https://goodreads.com',
    'https://thestorygraph.com'
  ),
  (
    'The Silent Patient', 
    'Alex Michaelides', 
    NULL,
    'Psychological Thriller', 
    '2019-02-05', 
    336, 
    4, 
    'A woman shoots her husband five times and then never speaks another word.', 
    'An impressive debut novel with a shocking twist. The author masterfully crafts a psychological thriller that keeps you guessing until the very end.',
    '2023-05-15',
    'https://placehold.co/400x600/black/white?text=The+Silent+Patient',
    'https://goodreads.com',
    'https://thestorygraph.com'
  ),
  (
    'The Midnight Library', 
    'Matt Haig', 
    NULL,
    'Fantasy', 
    '2020-08-13', 
    304, 
    5, 
    'Between life and death there is a library filled with books containing different versions of your life.', 
    'A beautiful and uplifting novel about the choices we make, the paths not taken, and the power of second chances.',
    '2023-04-18',
    'https://placehold.co/400x600/darkblue/white?text=The+Midnight+Library',
    'https://goodreads.com',
    'https://thestorygraph.com'
  ),
  (
    'Project Hail Mary', 
    'Andy Weir', 
    NULL,
    'Science Fiction', 
    '2021-05-04', 
    496, 
    5, 
    'A lone astronaut must save humanity from extinction.', 
    'A triumphant return to form for Andy Weir. This sci-fi adventure combines hard science with heart and humor in equal measure.',
    '2023-08-05',
    'https://placehold.co/400x600/gray/white?text=Project+Hail+Mary',
    'https://goodreads.com',
    'https://thestorygraph.com'
  ); 