'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Snowflake, Flame, Zap, Smartphone, Monitor, Wind, Brain } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  const name = language === 'ar' ? product.name_ar : product.name_en;
  const description = language === 'ar' ? product.description_ar : product.description_en;

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
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/30 group flex flex-col w-full h-full">
        {product.image_url && (
          <div className="relative w-full h-48 bg-gradient-to-br from-accent-light to-white overflow-hidden flex-shrink-0">
            <Image
              src={product.image_url}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-primary mb-2">{name}</h3>
          {description && (
            <p className="text-secondary text-sm mb-4 line-clamp-2">{description}</p>
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

          <div className="flex flex-wrap gap-3 text-sm pt-2 border-t border-primary/10 mt-auto">
            {product.price && (
              <div className="text-primary font-bold text-lg">
                {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
              </div>
            )}
            {product.power_hp && (
              <div className="text-secondary">
                <span className="font-medium text-primary">{t('power')}:</span>{' '}
                <span className="font-semibold">{product.power_hp} HP</span>
              </div>
            )}
            {product.color && (
              <div className="text-secondary">
                <span className="font-medium text-primary">{t('color')}:</span>{' '}
                <span className="font-semibold">{product.color}</span>
              </div>
            )}
            {product.warranty_years && (
              <div className="text-secondary">
                <span className="font-medium text-primary">{t('warranty')}:</span>{' '}
                <span className="font-semibold">{product.warranty_years} {language === 'ar' ? 'سنة' : 'years'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

