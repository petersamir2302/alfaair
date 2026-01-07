'use client';

import { Brand } from '@/lib/supabase/types';
import { BrandTable } from './BrandTable';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Breadcrumbs } from './Breadcrumbs';
import { BackButton } from './BackButton';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface AdminBrandsClientProps {
  brands: Brand[];
}

export function AdminBrandsClient({ brands }: AdminBrandsClientProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">{t('brands')}</h1>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addBrand')}</span>
        </Link>
      </div>

      <BrandTable brands={brands} />
    </div>
  );
}


