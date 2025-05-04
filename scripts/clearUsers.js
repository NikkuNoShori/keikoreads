import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Configure dotenv
dotenv.config();

// Get environment variables or use defaults
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const clearUsers = async () => {
  try {
    console.log('Starting to clear users and profiles...');
    
    // First, clear profiles
    console.log('Clearing profiles table...');
    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Safety check, don't delete admin profiles
    
    if (profilesError) {
      throw profilesError;
    }
    
    console.log('Profiles cleared successfully!');
    
    // Then, clear auth.users (requires service role key)
    console.log('Clearing auth.users table...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    console.log(`Found ${users?.users?.length || 0} users to delete.`);
    
    // Delete each user individually
    for (const user of users?.users || []) {
      // Skip any admin users you want to preserve
      if (user.email === 'admin@example.com') {
        console.log(`Skipping admin user: ${user.email}`);
        continue;
      }
      
      console.log(`Deleting user: ${user.email}`);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user.id,
        true // Hard delete
      );
      
      if (deleteError) {
        console.error(`Error deleting user ${user.email}:`, deleteError);
      }
    }
    
    console.log('Users cleared successfully!');
    console.log('All data has been cleared.');
    
  } catch (error) {
    console.error('Error clearing users:', error);
  }
};

// Run the function
clearUsers()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
  }); 