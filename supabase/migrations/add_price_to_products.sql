-- Add price column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC;

-- Add comment to price column
COMMENT ON COLUMN products.price IS 'Product price in EGP (Egyptian Pounds)';



