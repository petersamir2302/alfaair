'use client';

import { Category } from '@/lib/supabase/types';
import { CategoryTable } from './CategoryTable';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Breadcrumbs } from './Breadcrumbs';
import { BackButton } from './BackButton';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface AdminCategoriesClientProps {
  categories: Category[];
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">{t('categories')}</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addCategory')}</span>
        </Link>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}


