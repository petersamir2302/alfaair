-- Add order column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Set default order values for existing products based on created_at
UPDATE products 
SET "order" = subquery.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_number
  FROM products
) AS subquery
WHERE products.id = subquery.id;

-- Create index on order column for better query performance
CREATE INDEX IF NOT EXISTS idx_products_order ON products("order");


