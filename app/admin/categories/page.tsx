import { createClient } from '@/lib/supabase/server';
import { AdminCategoriesClient } from '@/components/AdminCategoriesClient';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name_ar', { ascending: true });

  return <AdminCategoriesClient categories={categories || []} />;
}



