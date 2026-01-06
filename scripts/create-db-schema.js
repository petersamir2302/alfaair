const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTableViaRPC() {
  console.log('📝 Attempting to create database schema...\n');
  
  const sql = `
-- Create products table
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
CREATE POLICY IF NOT EXISTS "Public can read products" ON products
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (admins)
CREATE POLICY IF NOT EXISTS "Authenticated users can insert products" ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update (admins)
CREATE POLICY IF NOT EXISTS "Authenticated users can update products" ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete (admins)
CREATE POLICY IF NOT EXISTS "Authenticated users can delete products" ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

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
  EXECUTE FUNCTION update_updated_at_column();
  `;

  // Try to execute via REST API using pg_net or direct SQL execution
  // Note: This requires the SQL to be executed via Supabase Dashboard SQL Editor
  // as Supabase doesn't allow arbitrary SQL execution via REST API for security
  
  console.log('⚠️  Supabase requires SQL to be executed via SQL Editor for security reasons.');
  console.log('📋 Please follow these steps:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/vegnmkhjmuxinqgeaqkk/sql/new');
  console.log('2. Copy and paste the SQL from: supabase/schema.sql');
  console.log('3. Click "Run" to execute\n');
  
  // Check if table already exists
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('❌ Products table does not exist yet.');
    console.log('📋 You need to run the SQL schema first.\n');
  } else if (error) {
    console.log('⚠️  Error checking table:', error.message);
  } else {
    console.log('✅ Products table already exists!');
    console.log('✅ Database schema is set up correctly.\n');
  }
}

async function main() {
  await createTableViaRPC();
}

main().catch(console.error);



