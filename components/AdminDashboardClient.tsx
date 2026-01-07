'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Package, Plus, Tag, FolderTree, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardClientProps {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
}

export function AdminDashboardClient({ totalProducts, totalBrands, totalCategories }: AdminDashboardClientProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {t('dashboard')}
        </h1>
        <p className="text-secondary">{t('welcomeMessage')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">{t('totalProducts')}</p>
              <p className="text-3xl font-bold text-primary">{totalProducts || 0}</p>
            </div>
            <Package className="w-12 h-12 text-primary/20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">{t('brands')}</p>
              <p className="text-3xl font-bold text-primary">{totalBrands || 0}</p>
            </div>
            <Tag className="w-12 h-12 text-primary/20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">{t('categories')}</p>
              <p className="text-3xl font-bold text-primary">{totalCategories || 0}</p>
            </div>
            <FolderTree className="w-12 h-12 text-primary/20" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">{t('quickActions')}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{t('addNewProduct')}</span>
          </Link>
          <Link
            href="/admin/brands/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{t('addBrand')}</span>
          </Link>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{t('addCategory')}</span>
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>{language === 'ar' ? 'المدونة' : 'Blog'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

