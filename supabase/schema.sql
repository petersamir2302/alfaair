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
  price NUMERIC,
  price_before NUMERIC,
  additional_specs_ar TEXT,
  additional_specs_en TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products
CREATE POLICY "Public can read products" ON products
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (admins)
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update (admins)
CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete (admins)
CREATE POLICY "Authenticated users can delete products" ON products
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
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for product images (run this in Supabase Dashboard Storage section)
-- Or use: INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);


