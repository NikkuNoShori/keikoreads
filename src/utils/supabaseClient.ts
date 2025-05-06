import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Debug: Check if environment variables are loaded
console.log('Supabase URL:', supabaseUrl ? 'loaded' : 'missing');
console.log('Supabase Key:', supabaseKey ? 'loaded' : 'missing');

export const supabase = createClient(supabaseUrl, supabaseKey); 