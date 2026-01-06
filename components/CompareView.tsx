'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useCompare } from './CompareProvider';
import { X, Check, ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import { BackButton } from './BackButton';
import { Breadcrumbs } from './Breadcrumbs';
import { useCart } from './CartProvider';
import { useEffect, useRef } from 'react';

export function CompareView() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart, isInCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const leftGradientRef = useRef<HTMLDivElement>(null);
  const rightGradientRef = useRef<HTMLDivElement>(null);

  if (compareItems.length === 0) {
    return (
      <div>
        <Breadcrumbs />
        <BackButton />
        <div className="bg-slate-800 rounded-xl p-12 md:p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
              <X className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-300 text-lg md:text-xl mb-6">
              {language === 'ar' ? 'لا توجد منتجات للمقارنة' : 'No products to compare'}
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

  const features = [
    { key: 'cold', label: t('cold') },
    { key: 'hot', label: t('hot') },
    { key: 'inverter', label: t('inverter') },
    { key: 'smart', label: t('smart') },
    { key: 'digitalScreen', label: t('digitalScreen') },
    { key: 'plasma', label: t('plasma') },
    { key: 'ai', label: t('ai') },
  ];

  // Map feature keys to product properties
  const getFeatureValue = (product: Product, featureKey: string): boolean => {
    switch (featureKey) {
      case 'cold': return product.cold;
      case 'hot': return product.hot;
      case 'inverter': return product.inverter;
      case 'smart': return product.smart;
      case 'digitalScreen': return product.digital_screen;
      case 'plasma': return product.plasma;
      case 'ai': return product.ai;
      default: return false;
    }
  };

  // Scroll to show partial columns on initial load and update gradient visibility
  useEffect(() => {
    if (scrollContainerRef.current && compareItems.length > 1) {
      const container = scrollContainerRef.current;
      
      const updateGradients = () => {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        // Show/hide gradients based on scroll position
        if (leftGradientRef.current) {
          leftGradientRef.current.style.opacity = scrollLeft > 10 ? '1' : '0';
        }
        if (rightGradientRef.current) {
          rightGradientRef.current.style.opacity = scrollLeft < maxScroll - 10 ? '1' : '0';
        }
      };
      
      // Wait for next frame to ensure layout is complete
      requestAnimationFrame(() => {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        
        // If content is wider than container, scroll to show partial columns
        if (scrollWidth > clientWidth) {
          // Calculate scroll position to center the view (showing partial columns on both sides)
          // This makes both fade gradients visible initially
          const scrollPosition = (scrollWidth - clientWidth) / 2;
          container.scrollLeft = scrollPosition;
        }
        
        // Update gradients after initial scroll
        updateGradients();
      });
      
      // Add scroll listener
      container.addEventListener('scroll', updateGradients);
      
      return () => {
        container.removeEventListener('scroll', updateGradients);
      };
    }
  }, [compareItems.length]);

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {language === 'ar' ? 'مقارنة المنتجات' : 'Compare Products'}
          </h1>
          <p className="text-gray-400 text-sm">
            {language === 'ar' 
              ? `مقارنة ${compareItems.length} منتج${compareItems.length > 1 ? 'ات' : ''}`
              : `Comparing ${compareItems.length} product${compareItems.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg relative">
        {/* Left gradient overlay - shows when scrolled right */}
        <div 
          ref={leftGradientRef}
          className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-800 via-slate-800/80 to-transparent pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: 1 }}
        />
        {/* Right gradient overlay - shows when scrolled left */}
        <div 
          ref={rightGradientRef}
          className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-800 via-slate-800/80 to-transparent pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: 1 }}
        />
        
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-700 bg-slate-900">
                <th className="px-4 md:px-6 py-5 text-right text-gray-300 font-semibold sticky right-0 bg-slate-900 z-20 min-w-[180px] md:min-w-[200px]">
                  {language === 'ar' ? 'المميزات' : 'Features'}
                </th>
                {compareItems.map((product) => (
                  <th key={product.id} className="px-4 md:px-6 py-5 text-center min-w-[220px] md:min-w-[280px] relative bg-slate-800/50">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-3 left-3 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg z-10"
                      title={language === 'ar' ? 'إزالة' : 'Remove'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <Link href={`/products/${product.id}`} className="block hover:opacity-90 transition-opacity group">
                      <div className="relative w-full h-40 md:h-48 mb-4 bg-slate-900 rounded-lg overflow-hidden">
                        {(product.images && product.images.length > 0 ? product.images[0] : product.image_url) && (
                          <Image
                            src={product.images && product.images.length > 0 ? product.images[0] : product.image_url!}
                            alt={language === 'ar' ? product.name_ar : product.name_en}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <h3 className="text-white font-bold text-base md:text-lg mb-2 line-clamp-2 min-h-[3rem]">
                        {language === 'ar' ? product.name_ar : product.name_en}
                      </h3>
                      {product.price && (
                        <p className="text-primary font-bold text-lg md:text-xl mb-3">
                          {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </p>
                      )}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-4 md:px-6 py-4 text-gray-300 font-semibold sticky right-0 bg-slate-800 z-10">
                  {t('price')}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="px-4 md:px-6 py-4 text-center">
                    {product.price ? (
                      <span className="text-white font-bold text-lg md:text-xl">
                        {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Power */}
              <tr className="border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-4 md:px-6 py-4 text-gray-300 font-semibold sticky right-0 bg-slate-800 z-10">
                  {t('power')}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="px-4 md:px-6 py-4 text-center">
                    {product.power_hp ? (
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-primary/20 text-primary font-semibold rounded-lg">
                        {product.power_hp} HP
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Color */}
              <tr className="border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-4 md:px-6 py-4 text-gray-300 font-semibold sticky right-0 bg-slate-800 z-10">
                  {t('color')}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="px-4 md:px-6 py-4 text-center">
                    {product.color ? (
                      <span className="inline-flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border-2 border-gray-600 ${
                          product.color.toLowerCase() === 'white' ? 'bg-white' : 'bg-gray-900'
                        }`}></span>
                        <span className="text-white capitalize">{product.color}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr className="border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-4 md:px-6 py-4 text-gray-300 font-semibold sticky right-0 bg-slate-800 z-10">
                  {t('warranty')}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="px-4 md:px-6 py-4 text-center">
                    {product.warranty_years ? (
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-green-500/20 text-green-400 font-semibold rounded-lg">
                        {product.warranty_years} {language === 'ar' ? 'سنة' : 'years'}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Coverage Area */}
              <tr className="border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-4 md:px-6 py-4 text-gray-300 font-semibold sticky right-0 bg-slate-800 z-10">
                  {t('coverageArea')}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="px-4 md:px-6 py-4 text-center">
                    {product.coverage_area_sqm ? (
                      <span className="text-white font-medium">
                        {product.coverage_area_sqm} {language === 'ar' ? 'م²' : 'm²'}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Features Section Header */}
              <tr className="border-b-2 border-gray-700 bg-slate-900/50">
                <td colSpan={compareItems.length + 1} className="px-4 md:px-6 py-3">
                  <h3 className="text-gray-300 font-bold text-sm uppercase tracking-wider">
                    {language === 'ar' ? 'المميزات' : 'Features'}
                  </h3>
                </td>
              </tr>

              {/* Features */}
              {features.map(({ key, label }) => (
                <tr key={key} className="border-b border-gray-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 md:px-6 py-3 text-gray-300 font-medium sticky right-0 bg-slate-800 z-10">
                    {label}
                  </td>
                  {compareItems.map((product) => (
                    <td key={product.id} className="px-4 md:px-6 py-3 text-center">
                      {getFeatureValue(product, key) ? (
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <X className="w-5 h-5 text-red-400" />
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Description */}
              <tr className="border-b border-gray-700/50">
                <td className="px-4 md:px-6 py-4 text-gray-300 font-semibold sticky right-0 bg-slate-800 z-10 align-top pt-4">
                  {t('description')}
                </td>
                {compareItems.map((product) => (
                  <td key={product.id} className="px-4 md:px-6 py-4 text-center text-white text-sm leading-relaxed">
                    {language === 'ar' ? product.description_ar : product.description_en || (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr className="bg-slate-900/30">
                <td className="px-4 md:px-6 py-6 sticky right-0 bg-slate-900/30 z-10"></td>
                {compareItems.map((product) => {
                  const inCart = isInCart(product.id);
                  const isSoldOut = (product.inventory ?? 0) === 0;
                  
                  return (
                    <td key={product.id} className="px-4 md:px-6 py-6 text-center">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm"
                        >
                          <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        {!isSoldOut && (
                          <button
                            onClick={() => addToCart(product, 1)}
                            disabled={inCart}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                              inCart
                                ? 'bg-green-600 text-white cursor-not-allowed'
                                : 'bg-slate-700 hover:bg-slate-600 text-white'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>
                              {inCart
                                ? (language === 'ar' ? 'في السلة' : 'In Cart')
                                : (language === 'ar' ? 'إضافة للسلة' : 'Add to Cart')
                              }
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

