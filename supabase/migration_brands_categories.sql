-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT, -- Optional icon identifier
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add brand_id and category_id to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Enable Row Level Security for brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for brands: Public read, authenticated write
CREATE POLICY "Public can read brands" ON brands
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert brands" ON brands
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update brands" ON brands
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete brands" ON brands
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies for categories: Public read, authenticated write
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create triggers to update updated_at for brands
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers to update updated_at for categories
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories based on the screenshot
-- Using DO NOTHING to prevent duplicates if categories already exist
INSERT INTO categories (name_ar, name_en, icon) VALUES
  ('مخفي في السقف', 'DUCT CONCEALED', 'duct-concealed'),
  ('كاسيت', 'CASSETTE', 'cassette'),
  ('أرضي', 'FLOOR', 'floor'),
  ('برج حر', 'TOWER FREE STAND', 'tower-free-stand'),
  ('سبليت', 'SPLIT', 'split'),
  ('أخرى', 'OTHER', 'other')
ON CONFLICT DO NOTHING;

