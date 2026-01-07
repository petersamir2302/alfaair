'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useFavorites } from './FavoriteProvider';
import { X, ArrowRight, Trash2, Heart } from 'lucide-react';
import { BackButton } from './BackButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductCard } from './ProductCard';

export function FavoritesView() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { favoriteItems, removeFromFavorites, clearFavorites } = useFavorites();

  if (favoriteItems.length === 0) {
    return (
      <div>
        <Breadcrumbs />
        <BackButton />
        <div className="bg-slate-800 rounded-xl p-12 md:p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-300 text-lg md:text-xl mb-6">
              {language === 'ar' ? 'لا توجد منتجات مفضلة' : 'No favorite products'}
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              <span>{language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {language === 'ar' ? 'المنتجات المفضلة' : 'Favorite Products'}
          </h1>
          <p className="text-gray-400 text-sm">
            {language === 'ar' 
              ? `${favoriteItems.length} منتج${favoriteItems.length > 1 ? 'ات' : ''} مفضل${favoriteItems.length > 1 ? 'ة' : ''}`
              : `${favoriteItems.length} favorite product${favoriteItems.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        <button
          onClick={clearFavorites}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteItems.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromFavorites(product.id);
              }}
              className="absolute top-2 right-2 z-30 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
              title={language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

