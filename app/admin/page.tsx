import { createClient } from '@/lib/supabase/server';
import { AdminDashboardClient } from '@/components/AdminDashboardClient';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  return <AdminDashboardClient totalProducts={count || 0} />;
}

