const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase PostgreSQL connection
// Use the exact format from Supabase connection string
const password = encodeURIComponent('P3t3r@supabase');
const connectionStrings = [
  // Direct connection format
  `postgresql://postgres:${password}@db.vegnmkhjmuxinqgeaqkk.supabase.co:5432/postgres`,
  // Pooler connection (transaction mode)
  `postgresql://postgres.vegnmkhjmuxinqgeaqkk:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  // Pooler connection (session mode)
  `postgresql://postgres.vegnmkhjmuxinqgeaqkk:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
];

async function executeSchema() {
  let client;
  let connected = false;

  // Try each connection string
  for (const connStr of connectionStrings) {
    client = new Client({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      console.log('🔄 Attempting database connection...');
      await client.connect();
      console.log('✅ Connected successfully!\n');
      connected = true;
      break;
    } catch (error) {
      console.log(`⚠️  Connection failed: ${error.message}`);
      try {
        await client.end();
      } catch (e) {
        // Ignore
      }
    }
  }

  if (!connected) {
    throw new Error('Could not connect to database with any connection string');
  }

  try {
    console.log('✅ Connected successfully!\n');

    // Read SQL schema file
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📝 Executing database schema...\n');

    // Execute the SQL
    await client.query(sql);

    console.log('✅ Database schema created successfully!');
    console.log('   - Products table created');
    console.log('   - Row Level Security enabled');
    console.log('   - Policies created');
    console.log('   - Trigger function created\n');

    // Verify table exists
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `);

    console.log('📊 Products table structure:');
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.column_name} (${row.data_type})`);
    });

    console.log('\n✨ Database setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Check if table already exists
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('\n⚠️  Some objects already exist. This is okay - continuing...');
    } else {
      throw error;
    }
  } finally {
    await client.end();
  }
}

executeSchema().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

