const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function executeSQL(sql) {
  // Try using Supabase REST API to execute SQL
  // First, try to create a function that can execute SQL if it doesn't exist
  const projectRef = 'vegnmkhjmuxinqgeaqkk';
  
  try {
    // Use the Management API endpoint
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

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SQL executed successfully:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('⚠️  Management API failed:', errorText);
    }
  } catch (error) {
    console.log('⚠️  Management API error:', error.message);
  }

  // Alternative: Try using PostgREST RPC if we have a function
  // Or use the direct SQL execution via pg_net extension
  return false;
}

async function createTableProgrammatically() {
  console.log('📝 Creating database schema programmatically...\n');

  // Since we can't execute arbitrary SQL, let's try creating the table structure
  // using Supabase's REST API by making individual API calls
  
  // First, check if table exists
  const { data: existingTable, error: checkError } = await supabase
    .from('products')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('✅ Products table already exists!');
    return;
  }

  if (checkError.code !== '42P01') {
    console.log('⚠️  Error checking table:', checkError.message);
  }

  // Try to execute SQL via REST API using a custom RPC function
  // We'll need to create the table via SQL execution
  const sql = `
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  cold BOOLEAN DEFAULT false,
  hot BOOLEAN DEFAULT false,
  inverter BOOLEAN DEFAULT false,
  power_hp NUMERIC,
  color TEXT,
  smart BOOLEAN DEFAULT false,
  digital_screen BOOLEAN DEFAULT false,
  plasma BOOLEAN DEFAULT false,
  ai BOOLEAN DEFAULT false,
  warranty_years NUMERIC,
  additional_specs_ar TEXT,
  additional_specs_en TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read products" ON products
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
  `;

  // Try executing via direct HTTP request to Supabase's SQL execution endpoint
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✅ SQL executed successfully via RPC!');
      return;
    }
  } catch (error) {
    console.log('⚠️  RPC method failed:', error.message);
  }

  // Try using pg_net extension if available
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (!error) {
      console.log('✅ SQL executed via pg_net!');
      return;
    }
  } catch (error) {
    console.log('⚠️  pg_net method failed');
  }

  // Last resort: Use Supabase Management API
  console.log('🔄 Trying Supabase Management API...');
  const success = await executeSQL(sql);
  
  if (!success) {
    console.log('\n❌ Could not execute SQL automatically.');
    console.log('📋 Please run the SQL manually in Supabase Dashboard → SQL Editor');
    console.log('   URL: https://supabase.com/dashboard/project/vegnmkhjmuxinqgeaqkk/sql/new');
  }
}

async function main() {
  await createTableProgrammatically();
  
  // Verify table was created
  console.log('\n🔍 Verifying table creation...');
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('❌ Table still does not exist. Please run SQL manually.');
  } else if (error) {
    console.log('⚠️  Error:', error.message);
  } else {
    console.log('✅ Products table verified and ready!');
  }
}

main().catch(console.error);




