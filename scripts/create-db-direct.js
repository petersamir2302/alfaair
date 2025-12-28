const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase connection details
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.vegnmkhjmuxinqgeaqkk.supabase.co:5432/postgres';

// Try using service role key as password (might work)
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

async function executeSQL() {
  // Read SQL schema
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  // Try different connection methods
  const connectionStrings = [
    // Try with service role key as password
    `postgresql://postgres.vegnmkhjmuxinqgeaqkk:${serviceRoleKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    // Try standard format
    connectionString.replace('[YOUR-PASSWORD]', serviceRoleKey),
    // Try with project ref
    `postgresql://postgres:${serviceRoleKey}@db.vegnmkhjmuxinqgeaqkk.supabase.co:5432/postgres`
  ];

  for (const connStr of connectionStrings) {
    const client = new Client({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      console.log('🔄 Attempting database connection...');
      await client.connect();
      console.log('✅ Connected to database!');
      
      console.log('📝 Executing SQL schema...');
      await client.query(sql);
      console.log('✅ Database schema created successfully!');
      
      await client.end();
      return true;
    } catch (error) {
      console.log(`⚠️  Connection failed: ${error.message}`);
      try {
        await client.end();
      } catch (e) {
        // Ignore
      }
    }
  }

  console.log('\n❌ Could not connect to database.');
  console.log('📋 Please provide the database password or run SQL manually.');
  console.log('   You can find it in Supabase Dashboard → Settings → Database');
  return false;
}

executeSQL().catch(console.error);


