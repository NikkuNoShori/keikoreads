# Supabase Integration Guide

> **Note:** This file is now located in the `docs/` directory. All SQL and migration scripts are now in the `database/` directory.

This project uses Supabase for database and authentication. Follow these instructions to set up and use Supabase.

## Setup with Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. After project creation, get your API URL and anon key from the project settings

## Connecting to Supabase

Create a `.env` file in your project root with the following content:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-id` and `your-anon-key` with the actual values from your Supabase project settings.

## Using Supabase in Your Application

The Supabase client is already installed and configured in `src/utils/supabaseClient.ts`.

You can import and use it in your components like this:

```typescript
import { supabase } from '../utils/supabaseClient';

// Example: Fetch data from a table
const fetchBooks = async () => {
  const { data, error } = await supabase
    .from('books')
    .select('*');
  
  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }
  
  return data || [];
};
```

## Setting Up Your Database

In the Supabase Dashboard:

1. Create a `books` table with the following columns:
   - `id` (uuid, primary key)
   - `title` (text)
   - `author` (text)
   - `rating` (integer)
   - `description` (text)
   - `review` (text)
   - `cover_image` (text, URL to image)
   - `created_at` (timestamp with timezone)

2. Set up the appropriate permissions for your table using Supabase's Row Level Security (RLS) policies. 