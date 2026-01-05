import { BrandForm } from '@/components/BrandForm';
import { AdminPageHeader } from '@/components/AdminPageHeader';

export default function NewBrandPage() {
  return (
    <div>
      <AdminPageHeader titleKey="addBrand" />
      <BrandForm />
    </div>
  );
}

