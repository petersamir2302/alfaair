const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

// Use fetch to directly call Supabase's SQL execution endpoint
async function executeSQLViaHTTP(sql) {
  const projectRef = 'vegnmkhjmuxinqgeaqkk';
  
  // Try Supabase's SQL execution endpoint (if available)
  try {
    const response = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`, {
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
      return true;
    }
  } catch (error) {
    // Try alternative endpoint
  }

  // Try using pg_net extension via RPC
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    // First, try to create an exec_sql function if it doesn't exist
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `;

    // Try executing via direct SQL (this won't work without the function existing)
    // Instead, let's try using Supabase's database REST API
    
    // Use the connection string approach - execute SQL via psql or direct connection
    // But we don't have direct database access
    
    return false;
  } catch (error) {
    return false;
  }
}

async function createTableUsingREST() {
  console.log('📝 Creating products table using Supabase REST API...\n');

  const sql = `-- Create products table
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

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Public can read products'
  ) THEN
    CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
  END IF;
END $$;

-- Policy: Only authenticated users can insert (admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Authenticated users can insert products'
  ) THEN
    CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Policy: Only authenticated users can update (admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Authenticated users can update products'
  ) THEN
    CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Policy: Only authenticated users can delete (admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Authenticated users can delete products'
  ) THEN
    CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();`;

  // Use Supabase's SQL execution via HTTP
  // Since Supabase doesn't expose direct SQL execution via REST API,
  // we need to use a workaround or the Management API
  
  // Try using the Supabase CLI approach via API
  const projectRef = 'vegnmkhjmuxinqgeaqkk';
  
  try {
    // Use Supabase's database API endpoint
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
      return true;
    } else {
      console.log('⚠️  Management API response:', result);
    }
  } catch (error) {
    console.log('⚠️  Management API error:', error.message);
  }

  // Alternative: Use Supabase's REST API to create table via migrations
  // But we need the migration API which requires different authentication
  
  console.log('\n❌ Could not execute SQL via API automatically.');
  console.log('📋 Supabase requires SQL to be executed via SQL Editor for security.');
  console.log('   Please run the SQL manually at:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  
  return false;
}

async function main() {
  await createTableUsingREST();
}

main().catch(console.error);


