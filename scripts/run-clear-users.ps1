# Set environment variables
$env:VITE_SUPABASE_URL = "https://dxnbvimslgqwyobfrrsx.supabase.co"
# Service role key
$env:VITE_SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bmJ2aW1zbGdxd3lvYmZycnN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjIxNzYxMiwiZXhwIjoyMDYxNzkzNjEyfQ.IcyT_QI8kJgz4XjgAcNIHN7SDml3iegDDXApqSB0HEI"

# Output current values (blank sensitive values for security)
Write-Host "Environment variables set:"
Write-Host "VITE_SUPABASE_URL: $env:VITE_SUPABASE_URL"
Write-Host "VITE_SUPABASE_SERVICE_KEY: [HIDDEN]"

# Run the script
Write-Host "Running clearUsers.js..."
node scripts/clearUsers.js 