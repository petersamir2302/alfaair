'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useCompare } from './CompareProvider';
import { useCart } from './CartProvider';
import { Snowflake, Flame, Zap, Smartphone, Monitor, Wind, Brain, Scale, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
  const { addToCart, isInCart } = useCart();

  const name = language === 'ar' ? product.name_ar : product.name_en;
  const description = language === 'ar' ? product.description_ar : product.description_en;
  const inCompare = isInCompare(product.id);
  const inCart = isInCart(product.id);
  const isSoldOut = (product.inventory ?? 0) === 0;

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      if (canAddMore()) {
        addToCompare(product);
      } else {
        alert(language === 'ar' 
          ? `يمكنك إضافة ما يصل إلى 4 منتجات للمقارنة. يرجى إزالة منتج أولاً.`
          : `You can add up to 4 products to compare. Please remove a product first.`
        );
      }
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSoldOut) {
      addToCart(product, 1);
    }
  };

  const features = [
    { key: 'cold' as const, value: product.cold, icon: Snowflake, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { key: 'hot' as const, value: product.hot, icon: Flame, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { key: 'inverter' as const, value: product.inverter, icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { key: 'smart' as const, value: product.smart, icon: Smartphone, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { key: 'digitalScreen' as const, value: product.digital_screen, icon: Monitor, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { key: 'plasma' as const, value: product.plasma, icon: Wind, color: 'bg-green-100 text-green-700 border-green-200' },
    { key: 'ai' as const, value: product.ai, icon: Brain, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  ].filter(f => f.value);

  return (
    <Link href={`/products/${product.id}`} className="h-full flex">
      <div className="bg-slate-800 rounded-lg transition-all duration-300 overflow-hidden group flex flex-col w-full h-full relative">
        {isSoldOut && (
          <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {t('soldOut')}
          </div>
        )}
        {product.best_seller && !isSoldOut && (
          <div className="absolute top-2 right-2 z-10 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {t('bestSeller')}
          </div>
        )}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-full transition-colors ${
              inCompare
                ? 'bg-primary text-white'
                : 'bg-slate-700/80 text-gray-300 hover:bg-primary hover:text-white'
            }`}
            title={inCompare ? (language === 'ar' ? 'إزالة من المقارنة' : 'Remove from compare') : (language === 'ar' ? 'إضافة للمقارنة' : 'Add to compare')}
          >
            <Scale className="w-4 h-4" />
          </button>
          {!isSoldOut && (
            <button
              onClick={handleCartClick}
              className={`p-2 rounded-full transition-colors ${
                inCart
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700/80 text-gray-300 hover:bg-green-600 hover:text-white'
              }`}
              title={inCart ? (language === 'ar' ? 'في السلة' : 'In cart') : (language === 'ar' ? 'إضافة للسلة' : 'Add to cart')}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className={`relative w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden flex-shrink-0 ${isSoldOut ? 'opacity-60' : ''}`}>
          {(product.image_url || (product.images && product.images.length > 0)) ? (
            <Image
              src={product.images && product.images.length > 0 ? product.images[0] : product.image_url!}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.placeholder')) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'placeholder absolute inset-0 flex items-center justify-center text-gray-500';
                  placeholder.innerHTML = '<svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className={`text-xl font-bold mb-2 ${isSoldOut ? 'text-gray-400' : 'text-white'}`}>{name}</h3>
          {description && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
          )}
          
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {features.map(({ key, icon: Icon, color }) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t(key)}</span>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-sm pt-2 border-t border-gray-700 mt-auto">
            {product.price && product.price_before ? (
              <div className="flex items-center gap-2">
                <div className="text-red-400 line-through text-sm">
                  {product.price_before.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
                <div className="text-green-400 font-bold text-lg">
                  {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              </div>
            ) : product.price ? (
              <div className="text-white font-bold text-lg">
                {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
              </div>
            ) : null}
            {product.power_hp && (
              <div className="text-gray-300">
                <span className="font-medium text-white">{t('power')}:</span>{' '}
                <span className="font-semibold">{product.power_hp} HP</span>
              </div>
            )}
            {product.color && (
              <div className="text-gray-300">
                <span className="font-medium text-white">{t('color')}:</span>{' '}
                <span className="font-semibold">{product.color}</span>
              </div>
            )}
            {product.warranty_years && (
              <div className="text-gray-300">
                <span className="font-medium text-white">{t('warranty')}:</span>{' '}
                <span className="font-semibold">{product.warranty_years} {language === 'ar' ? 'سنة' : 'years'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

