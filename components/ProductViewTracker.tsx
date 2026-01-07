'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/supabase/types';
import { trackViewItem } from '@/lib/analytics';

interface ProductViewTrackerProps {
  product: Product;
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    // Track product view
    trackViewItem({
      id: product.id,
      name: product.name_en || product.name_ar,
      price: product.price || undefined,
      brand: undefined, // Can be fetched from brand_id if needed
      category: undefined, // Can be fetched from category_id if needed
    });
  }, [product.id]);

  return null;
}

