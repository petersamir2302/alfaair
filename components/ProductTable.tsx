'use client';

import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      alert(error.message);
    } else {
      router.refresh();
    }
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-primary/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('image')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('name')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('price')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('power')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('color')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const name = language === 'ar' ? product.name_ar : product.name_en;
              return (
                <tr key={product.id} className="border-t border-secondary/20 hover:bg-accent-light/50">
                  <td className="px-4 py-3">
                    {product.image_url ? (
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={product.image_url}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-secondary/20 rounded"></div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{name}</div>
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {product.price ? `${product.price.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {product.power_hp ? `${product.power_hp} HP` : '-'}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {product.color || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-secondary">
            {t('noProducts')}
          </div>
        )}
      </div>
    </div>
  );
}

