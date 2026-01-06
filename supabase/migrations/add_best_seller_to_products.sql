-- Add best_seller column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT false;

-- Create index on best_seller column for better query performance
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(best_seller);

