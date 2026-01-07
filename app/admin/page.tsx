import { createClient } from '@/lib/supabase/server';
import { AdminDashboardClient } from '@/components/AdminDashboardClient';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const [productsResult, brandsResult, categoriesResult, ordersResult] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <AdminDashboardClient 
      totalProducts={productsResult.count || 0}
      totalBrands={brandsResult.count || 0}
      totalCategories={categoriesResult.count || 0}
      totalOrders={ordersResult.count || 0}
    />
  );
}

