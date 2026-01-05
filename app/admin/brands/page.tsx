import { createClient } from '@/lib/supabase/server';
import { AdminBrandsClient } from '@/components/AdminBrandsClient';

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('name_ar', { ascending: true });

  return <AdminBrandsClient brands={brands || []} />;
}

