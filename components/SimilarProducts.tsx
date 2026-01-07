'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { ProductCard } from './ProductCard';
import { useLanguage } from './LanguageProvider';

interface SimilarProductsProps {
  productId: string;
  brandId: string | null;
  powerHp: number | null;
  filterType: 'brand' | 'horsepower';
  limit?: number;
}

export function SimilarProducts({ productId, brandId, powerHp, filterType, limit = 4 }: SimilarProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setLoading(true);
      
      const client = createClient();
      let query = client
        .from('products')
        .select('*')
        .neq('id', productId); // Exclude current product

      if (filterType === 'brand' && brandId) {
        query = query.eq('brand_id', brandId);
      } else if (filterType === 'horsepower' && powerHp !== null) {
        query = query.eq('power_hp', powerHp);
      } else {
        // If no filter criteria, return empty
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query
        .order('order', { ascending: true, nullsFirst: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching similar products:', error);
        setProducts([]);
      } else {
        // Sort by order and created_at
        const sorted = (data || []).sort((a, b) => {
          const orderA = a.order ?? Infinity;
          const orderB = b.order ?? Infinity;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setProducts(sorted);
      }
      
      setLoading(false);
    };

    fetchSimilarProducts();
  }, [productId, brandId, powerHp, filterType, limit]);

  // Don't render if no products or no filter criteria
  if (loading || products.length === 0) {
    return null;
  }

  const sectionTitle = filterType === 'brand'
    ? (language === 'ar' ? 'منتجات مشابهة من نفس الماركة' : 'Similar Products from the Same Brand')
    : (language === 'ar' ? 'منتجات مشابهة بنفس القوة' : 'Similar Products with the Same Horsepower');

  return (
    <div className="mt-12 mb-24 md:mb-32">
      <h2 className="text-2xl font-bold text-white mb-6">{sectionTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

