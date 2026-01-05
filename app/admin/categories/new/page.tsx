import { CategoryForm } from '@/components/CategoryForm';
import { AdminPageHeader } from '@/components/AdminPageHeader';

export default function NewCategoryPage() {
  return (
    <div>
      <AdminPageHeader titleKey="addCategory" />
      <CategoryForm />
    </div>
  );
}

