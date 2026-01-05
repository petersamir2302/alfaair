'use client';

import Image from 'next/image';
import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { OrderForm } from './OrderForm';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  const name = language === 'ar' ? product.name_ar : product.name_en;
  const description = language === 'ar' ? product.description_ar : product.description_en;
  const additionalSpecs = language === 'ar' ? product.additional_specs_ar : product.additional_specs_en;

  const features = [
    { key: 'cold', value: product.cold, label: t('cold') },
    { key: 'hot', value: product.hot, label: t('hot') },
    { key: 'inverter', value: product.inverter, label: t('inverter') },
    { key: 'smart', value: product.smart, label: t('smart') },
    { key: 'digitalScreen', value: product.digital_screen, label: t('digitalScreen') },
    { key: 'plasma', value: product.plasma, label: t('plasma') },
    { key: 'ai', value: product.ai, label: t('ai') },
  ];

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'ar' ? 'العودة' : 'Back'}</span>
      </Link>

      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {product.image_url && (
            <div className="relative w-full h-96 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
              <Image
                src={product.image_url}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              {(product.inventory ?? 0) === 0 && (
                <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  {t('soldOut')}
                </span>
              )}
            </div>
            {description && (
              <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>
            )}

            <div className="space-y-4 mb-6">
              {product.price && (
                <div className="text-2xl font-bold text-white mb-2">
                  {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              )}
              {product.inventory !== null && product.inventory > 0 && (
                <div>
                  <span className="font-medium text-white">{t('inventory')}:</span>{' '}
                  <span className="text-gray-300">{product.inventory}</span>
                </div>
              )}
              {product.power_hp && (
                <div>
                  <span className="font-medium text-white">{t('power')}:</span>{' '}
                  <span className="text-gray-300">{product.power_hp} HP</span>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="font-medium text-white">{t('color')}:</span>{' '}
                  <span className="text-gray-300">{product.color}</span>
                </div>
              )}
              {product.warranty_years && (
                <div>
                  <span className="font-medium text-white">{t('warranty')}:</span>{' '}
                  <span className="text-gray-300">{product.warranty_years} {language === 'ar' ? 'سنة' : 'years'}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-white mb-3">{language === 'ar' ? 'المميزات' : 'Features'}</h3>
              <div className="grid grid-cols-2 gap-3">
                {features.map(({ key, value, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    {value ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-gray-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {additionalSpecs && (
              <div>
                <h3 className="font-bold text-white mb-3">{t('additionalSpecs')}</h3>
                <p className="text-gray-300 leading-relaxed">{additionalSpecs}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderForm product={product} />
    </div>
  );
}

