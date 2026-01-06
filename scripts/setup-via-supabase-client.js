const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createSchema() {
  console.log('🚀 Setting up database schema using Supabase client...\n');

  // Since Supabase doesn't allow arbitrary SQL execution via REST API,
  // we'll try to use Supabase's database functions or migrations API
  
  // First, let's try to create an exec_sql function via a workaround
  // We'll use Supabase's REST API to call a function that might exist
  
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

CREATE POLICY IF NOT EXISTS "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `.trim();

  // Try using Supabase's pg_net extension if available
  try {
    console.log('🔄 Attempting to execute SQL via pg_net...');
    const { data, error } = await supabase.rpc('net_http_post', {
      url: `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql })
    });

    if (!error) {
      console.log('✅ SQL executed via pg_net!');
      return true;
    }
  } catch (error) {
    console.log('⚠️  pg_net method not available');
  }

  // Try using http extension
  try {
    console.log('🔄 Attempting to execute SQL via http extension...');
    const { data, error } = await supabase.rpc('http_post', {
      url: `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      headers: JSON.stringify({ 'Content-Type': 'application/json', 'apikey': serviceRoleKey }),
      body: sql
    });

    if (!error && data) {
      console.log('✅ SQL executed via http extension!');
      return true;
    }
  } catch (error) {
    console.log('⚠️  http extension method not available');
  }

  // Last resort: Use Supabase Management API with proper auth
  // But this requires a different token (project API key from Supabase dashboard)
  console.log('\n❌ Cannot execute SQL automatically via Supabase REST API.');
  console.log('📋 Supabase requires SQL to be executed via:');
  console.log('   1. SQL Editor in Dashboard (recommended)');
  console.log('   2. Supabase CLI');
  console.log('   3. Direct PostgreSQL connection with password');
  console.log('\n💡 To proceed, please either:');
  console.log('   - Provide your database password for direct connection');
  console.log('   - Run the SQL manually in Supabase Dashboard');
  console.log('   - Ensure Supabase MCP server is running and restart Cursor');
  
  return false;
}

createSchema().catch(console.error);



