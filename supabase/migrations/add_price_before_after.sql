-- Add price_before column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_before NUMERIC;

-- Add comment to price_before column
COMMENT ON COLUMN products.price_before IS 'Original price before discount in EGP (Egyptian Pounds). The current price is stored in the price column.';

