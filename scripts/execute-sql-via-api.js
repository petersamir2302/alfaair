const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL() {
  console.log('🚀 Executing database schema via Supabase API...\n');

  // Read SQL schema
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  // Try to execute via Supabase REST API
  // First, check if we can use a custom RPC function
  // If not, we'll need to use direct PostgreSQL connection
  
  // Check if table already exists
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('✅ Products table already exists!');
      console.log('📊 Verifying structure...\n');
      
      // Get table structure
      const { data: columns } = await supabase.rpc('get_table_columns', { table_name: 'products' });
      if (columns) {
        console.log('Table columns:', columns);
      }
      return;
    }
  } catch (error) {
    // Table doesn't exist, continue with creation
  }

  // Since Supabase REST API doesn't support arbitrary SQL execution,
  // we need to use direct PostgreSQL connection
  // But the connection isn't working, so let's try using Supabase's SQL Editor API
  
  console.log('⚠️  Supabase REST API cannot execute arbitrary SQL for security reasons.');
  console.log('📋 Attempting alternative method...\n');

  // Try using Supabase Management API
  const projectRef = 'vegnmkhjmuxinqgeaqkk';
  
  try {
    // Use fetch to call Supabase's SQL execution endpoint
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        query: sql
      })
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ SQL executed successfully via Management API!');
      return;
    } else {
      console.log('⚠️  Management API response:', result);
    }
  } catch (error) {
    console.log('⚠️  Management API error:', error.message);
  }

  console.log('\n❌ Could not execute SQL automatically.');
  console.log('📋 Please execute the SQL manually in Supabase Dashboard:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('\nOr use Supabase CLI:');
  console.log('   supabase db push');
}

executeSQL().catch(console.error);



