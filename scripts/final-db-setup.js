const { Client } = require('pg');

// Try the connection string with proper encoding
// Password: P3t3r@supabase
const password = encodeURIComponent('P3t3r@supabase');
const connectionString = `postgresql://postgres:${password}@db.vegnmkhjmuxinqgeaqkk.supabase.co:5432/postgres`;

console.log('🔄 Connecting to database...');
console.log('Connection string (password hidden):', connectionString.replace(/:[^:@]+@/, ':****@'));

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
});

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
  EXECUTE FUNCTION update_updated_at_column();
`;

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to database!\n');
    
    console.log('📝 Executing SQL schema...\n');
    await client.query(sql);
    
    console.log('✅ Database schema created successfully!\n');
    
    // Verify
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Products table created with columns:');
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    console.log('\n✨ Setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 The database hostname might be incorrect.');
      console.log('   Please check your Supabase project settings for the correct connection string.');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed. Please verify the password is correct.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();



