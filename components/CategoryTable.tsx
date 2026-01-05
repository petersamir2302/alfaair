'use client';

import { Category } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteCategory'))) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      
      if (error) {
        alert(error.message || t('error'));
      } else {
        router.refresh();
      }
    } catch (err) {
      alert(t('error'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-primary/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('logo')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('name')} (AR)</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('name')} (EN)</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-secondary/20 hover:bg-accent-light/50">
                <td className="px-4 py-3">
                  {category.logo_url ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-white flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.logo_url}
                        alt={category.name_en}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<div class="w-16 h-16 bg-secondary/20 rounded flex items-center justify-center text-xs text-secondary">No Logo</div>';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-secondary/20 rounded flex items-center justify-center text-xs text-secondary">
                      {t('noLogo')}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-primary">{category.name_ar}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-primary">{category.name_en}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-8 text-center text-secondary">
            {t('noCategories')}
          </div>
        )}
      </div>
    </div>
  );
}

