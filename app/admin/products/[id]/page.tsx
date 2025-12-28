import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/ProductForm';
import { AdminPageHeader } from '@/components/AdminPageHeader';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product || error) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader titleKey="editProduct" />
      <ProductForm product={product} />
    </div>
  );
}

