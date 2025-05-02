import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Database connection details
const dbHost = 'localhost';
const dbPort = '5432';
const dbName = 'postgres';
const dbUser = 'postgres';
const dbPassword = 'u58HwyQwS6LsT4hz';

async function applySchema() {
  try {
    console.log('Reading schema.sql file...');
    const schemaSql = fs.readFileSync('./schema.sql', 'utf8');
    
    console.log('Creating temporary SQL file...');
    fs.writeFileSync('./temp-schema.sql', schemaSql);
    
    console.log('Applying schema to PostgreSQL...');
    const command = `docker exec -i keikoreads-postgres-1 psql -U ${dbUser} -d ${dbName} -f /var/lib/postgresql/data/temp-schema.sql`;
    
    // Copy the schema file to the container volume
    await execAsync(`docker cp ./temp-schema.sql keikoreads-postgres-1:/var/lib/postgresql/data/`);
    
    // Execute the schema
    const { stdout, stderr } = await execAsync(command);
    
    console.log('Schema applied successfully!');
    console.log(stdout);
    
    if (stderr) {
      console.error('Warnings/errors during schema application:');
      console.error(stderr);
    }
    
    // Clean up
    fs.unlinkSync('./temp-schema.sql');
    console.log('Temporary file removed');
    
    // Test the books table
    console.log('Testing books table existence...');
    const { stdout: testOutput, stderr: testError } = await execAsync(
      `docker exec -i keikoreads-postgres-1 psql -U ${dbUser} -d ${dbName} -c "SELECT COUNT(*) FROM books;"`
    );
    
    console.log('Books table test result:');
    console.log(testOutput);
    
    if (testError) {
      console.error('Warnings/errors during table test:');
      console.error(testError);
    }
  } catch (err) {
    console.error('Error applying schema:', err);
  }
}

// Run the function
applySchema(); 