import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Supabase connection details
const supabaseUrl = 'https://dxnbvimslgqwyobfrrsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bmJ2aW1zbGdxd3lvYmZycnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTc2MTIsImV4cCI6MjA2MTc5MzYxMn0.KvFRUzBW1aGPU3CvgMjESIvaBUG13ng_7kOmxkyJ_Po';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the schema.sql file
const schemaSql = fs.readFileSync('./schema.sql', 'utf8');

// Function to apply the schema
async function applySchema() {
  try {
    console.log('Applying schema to Supabase...');
    
    // Execute each statement separately
    const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const statement of statements) {
      console.log(`Executing SQL: ${statement.substring(0, 50)}...`);
      
      // Send the SQL query directly
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement.trim() + ';' 
      });
      
      if (error) {
        console.error('Error applying SQL statement:', error);
      }
    }
    
    console.log('Schema application attempted. Checking if books table exists...');
    
    // Verify if the books table was created
    const { data, error } = await supabase.from('books').select('*').limit(1);
    
    if (error) {
      console.error('Error checking books table:', error);
    } else {
      console.log('Books table exists!');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the function
applySchema(); 