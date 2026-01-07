import { createClient } from '@/lib/supabase/server';
import { AdminOrdersClient } from '@/components/AdminOrdersClient';

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return <AdminOrdersClient orders={orders || []} />;
}

