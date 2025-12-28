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
        className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'ar' ? 'العودة' : 'Back'}</span>
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-primary/10">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {product.image_url && (
            <div className="relative w-full h-96 bg-gradient-to-br from-accent-light to-white rounded-lg overflow-hidden">
              <Image
                src={product.image_url}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-primary mb-4">{name}</h1>
            {description && (
              <p className="text-secondary mb-6 leading-relaxed">{description}</p>
            )}

            <div className="space-y-4 mb-6">
              {product.price && (
                <div className="text-2xl font-bold text-primary mb-2">
                  {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              )}
              {product.power_hp && (
                <div>
                  <span className="font-medium text-primary">{t('power')}:</span>{' '}
                  <span className="text-secondary">{product.power_hp} HP</span>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="font-medium text-primary">{t('color')}:</span>{' '}
                  <span className="text-secondary">{product.color}</span>
                </div>
              )}
              {product.warranty_years && (
                <div>
                  <span className="font-medium text-primary">{t('warranty')}:</span>{' '}
                  <span className="text-secondary">{product.warranty_years} {language === 'ar' ? 'سنة' : 'years'}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-primary mb-3">{language === 'ar' ? 'المميزات' : 'Features'}</h3>
              <div className="grid grid-cols-2 gap-3">
                {features.map(({ key, value, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    {value ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-secondary">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {additionalSpecs && (
              <div>
                <h3 className="font-bold text-primary mb-3">{t('additionalSpecs')}</h3>
                <p className="text-secondary leading-relaxed">{additionalSpecs}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderForm product={product} />
    </div>
  );
}

