import { createClient } from '@/lib/supabase/server';
import { AdminProductsClient } from '@/components/AdminProductsClient';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  
  let { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching products:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    // If there's an error, try to fetch without the order column to see if that's the issue
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('products')
      .select('id, name_ar, name_en, created_at');
    
    if (!fallbackError && fallbackData) {
      console.log('Fallback query succeeded - issue might be with the order column or other columns');
      products = fallbackData as any; // Use fallback data temporarily
    }
  }
  
  // Sort by order and created_at (PostgREST doesn't support multiple order calls)
  const sortedProducts = products?.sort((a: any, b: any) => {
    const orderA = a.order ?? Infinity;
    const orderB = b.order ?? Infinity;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return <AdminProductsClient products={sortedProducts || []} />;
}

