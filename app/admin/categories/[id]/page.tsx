import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/CategoryForm';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader titleKey="editCategory" />
      <CategoryForm category={category} />
    </div>
  );
}

