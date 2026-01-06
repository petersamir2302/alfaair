-- Migration: Add images array support to products table
-- This migration adds a new column to store multiple images as JSON array

-- Add images column as JSONB array (PostgreSQL native JSON support)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Migrate existing image_url to images array if image_url exists
UPDATE products 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN jsonb_build_array(image_url)
  ELSE '[]'::jsonb
END
WHERE images = '[]'::jsonb OR images IS NULL;

-- Keep image_url for backward compatibility, but images array is the primary source
-- You can optionally remove image_url column later if not needed:
-- ALTER TABLE products DROP COLUMN IF EXISTS image_url;


