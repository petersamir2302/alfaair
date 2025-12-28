import { ProductForm } from '@/components/ProductForm';
import { AdminPageHeader } from '@/components/AdminPageHeader';

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader titleKey="addNewProduct" />
      <ProductForm />
    </div>
  );
}

