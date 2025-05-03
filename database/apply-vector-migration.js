import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Database connection details
const dbName = 'postgres';
const dbUser = 'postgres';

async function applyVectorMigration() {
  try {
    console.log('Checking if migrations directory exists...');
    if (!fs.existsSync('./supabase/migrations')) {
      fs.mkdirSync('./supabase/migrations', { recursive: true });
      console.log('Created migrations directory');
    }
    
    console.log('Creating temporary SQL file...');
    const vectorSql = fs.readFileSync('./supabase/migrations/vector.sql', 'utf8');
    fs.writeFileSync('./temp-vector.sql', vectorSql);
    
    console.log('Applying vector migration to PostgreSQL...');
    
    // Copy the migration file to the container volume
    await execAsync(`docker cp ./temp-vector.sql keikoreads-postgres-1:/var/lib/postgresql/data/`);
    
    // Execute the migration
    const command = `docker exec -i keikoreads-postgres-1 psql -U ${dbUser} -d ${dbName} -f /var/lib/postgresql/data/temp-vector.sql`;
    const { stdout, stderr } = await execAsync(command);
    
    console.log('Vector migration applied successfully!');
    console.log(stdout);
    
    if (stderr) {
      console.error('Warnings/errors during migration:');
      console.error(stderr);
    }
    
    // Clean up
    fs.unlinkSync('./temp-vector.sql');
    console.log('Temporary file removed');
    
    // Test if vector extension is installed
    console.log('Testing if vector extension is installed...');
    const { stdout: testOutput, stderr: testError } = await execAsync(
      `docker exec -i keikoreads-postgres-1 psql -U ${dbUser} -d ${dbName} -c "SELECT * FROM pg_extension WHERE extname = 'vector';"`
    );
    
    console.log('Vector extension test result:');
    console.log(testOutput);
    
    if (testError) {
      console.error('Warnings/errors during test:');
      console.error(testError);
    }
    
    // Test if embedding column exists
    console.log('Testing if embedding column exists in books table...');
    const { stdout: columnOutput, stderr: columnError } = await execAsync(
      `docker exec -i keikoreads-postgres-1 psql -U ${dbUser} -d ${dbName} -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'embedding';"`
    );
    
    console.log('Embedding column test result:');
    console.log(columnOutput);
    
    if (columnError) {
      console.error('Warnings/errors during column test:');
      console.error(columnError);
    }
  } catch (err) {
    console.error('Error applying vector migration:', err);
  }
}

// Run the function
applyVectorMigration(); 