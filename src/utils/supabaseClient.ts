import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Check if environment variables are loaded
console.log('Supabase URL:', supabaseUrl ? 'loaded' : 'missing');
console.log('Supabase Key:', supabaseKey ? 'loaded' : 'missing');

// Use hardcoded values if environment variables are not available
const url = supabaseUrl || 'https://dxnbvimslgqwyobfrrsx.supabase.co';
const key = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bmJ2aW1zbGdxd3lvYmZycnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTc2MTIsImV4cCI6MjA2MTc5MzYxMn0.KvFRUzBW1aGPU3CvgMjESIvaBUG13ng_7kOmxkyJ_Po';

export const supabase = createClient(url, key); 