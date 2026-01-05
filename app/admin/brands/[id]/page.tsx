import { createClient } from '@/lib/supabase/server';
import { BrandForm } from '@/components/BrandForm';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { notFound } from 'next/navigation';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !brand) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader titleKey="editBrand" />
      <BrandForm brand={brand} />
    </div>
  );
}

