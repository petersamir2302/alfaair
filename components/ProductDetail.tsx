'use client';

import Image from 'next/image';
import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useCompare } from './CompareProvider';
import { useCart } from './CartProvider';
import { useRouter } from 'next/navigation';
import { Check, X, Scale, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { useState } from 'react';
import { BackButton } from './BackButton';
import { Breadcrumbs } from './Breadcrumbs';
import Link from 'next/link';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { addToCompare, removeFromCompare, isInCompare, canAddMore, compareItems } = useCompare();
  const { addToCart, isInCart } = useCart();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const inCompare = isInCompare(product.id);
  const inCart = isInCart(product.id);
  const isSoldOut = (product.inventory ?? 0) === 0;
  const maxQuantity = product.inventory ?? Infinity;

  const handleCompareClick = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      if (canAddMore()) {
        // Check if this is the first product
        if (compareItems.length === 0) {
          addToCompare(product);
          alert(language === 'ar' 
            ? `تمت إضافة المنتج للمقارنة. يرجى إضافة منتج آخر للمقارنة.`
            : `Product added to compare. Please add another product to compare.`
          );
        } else {
          // This will be the second product, redirect to compare page
          const shouldRedirect = addToCompare(product);
          if (shouldRedirect) {
            router.push('/compare');
          }
        }
      } else {
        alert(language === 'ar' 
          ? `يمكنك إضافة ما يصل إلى 4 منتجات للمقارنة. يرجى إزالة منتج أولاً.`
          : `You can add up to 4 products to compare. Please remove a product first.`
        );
      }
    }
  };

  const handleAddToCart = () => {
    if (!isSoldOut) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const name = language === 'ar' ? product.name_ar : product.name_en;
  const description = language === 'ar' ? product.description_ar : product.description_en;
  const additionalSpecs = language === 'ar' ? product.additional_specs_ar : product.additional_specs_en;

  // Get all images - prefer images array, fallback to image_url
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image_url ? [product.image_url] : []);
  
  const selectedImage = allImages[selectedImageIndex] || allImages[0];

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
      <Breadcrumbs />
      <BackButton />

      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {selectedImage && (
            <div className="space-y-4">
              {/* Main image with hover zoom */}
              <div className="relative w-full h-96 rounded-lg overflow-hidden group cursor-zoom-in">
                <Image
                  src={selectedImage}
                  alt={name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Thumbnail gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-primary scale-105'
                          : 'border-transparent hover:border-gray-500'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${name} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col md:block">
            <div className="flex items-center gap-4 mb-4 flex-wrap relative">
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              {product.best_seller && (product.inventory ?? 0) > 0 && (
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  {t('bestSeller')}
                </span>
              )}
              {(product.inventory ?? 0) === 0 && (
                <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  {t('soldOut')}
                </span>
              )}
            </div>

            <div className="space-y-4 mb-6 order-1 md:order-none">
              {product.price && product.price_before ? (
                <div className="mb-2">
                  <div className="text-red-400 line-through text-lg mb-1">
                    {product.price_before.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </div>
                </div>
              ) : product.price ? (
                <div className="text-2xl font-bold text-white mb-2">
                  {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              ) : null}
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

            <div className="mb-6 order-2 md:order-none">
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
              <div className="order-3 md:order-none">
                <h3 className="font-bold text-white mb-3">{t('additionalSpecs')}</h3>
                <p className="text-gray-300 leading-relaxed">{additionalSpecs}</p>
              </div>
            )}

            {description && (
              <div className="order-4 md:order-none">
                <div 
                  className="text-gray-300 mb-6 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar - Mobile */}
      {!isSoldOut && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-gray-700 shadow-lg md:hidden">
          <div className="container mx-auto px-3 py-3">
            <div className="flex items-center gap-2">
              {/* Compare Button */}
              <button
                onClick={handleCompareClick}
                className={`flex items-center gap-1.5 h-10 px-2 rounded-lg transition-colors flex-shrink-0 ${
                  inCompare
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-primary hover:text-white'
                }`}
              >
                <Scale className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap">
                  {inCompare 
                    ? (language === 'ar' ? 'إزالة' : 'Remove')
                    : (language === 'ar' ? 'مقارنة' : 'Compare')
                  }
                </span>
              </button>

              {/* Price */}
              {product.price && product.price_before ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-red-400 line-through text-xs">
                    {product.price_before.toLocaleString()}
                  </span>
                  <span className="text-green-400 font-bold text-xs">
                    {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              ) : product.price ? (
                <div className="text-white font-bold text-xs flex-shrink-0">
                  {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              ) : null}
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-1 flex-shrink-0 h-10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(val, maxQuantity));
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="h-10 w-10 px-1 bg-slate-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-xs [text-align:center]"
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="h-10 w-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-1.5 h-10 px-2 rounded-lg transition-colors font-medium text-xs ${
                  inCart
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {inCart 
                    ? (language === 'ar' ? 'في السلة' : 'In Cart')
                    : (language === 'ar' ? 'إضافة' : 'Add')
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Bottom Bar */}
      {!isSoldOut && (
        <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-gray-700 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                {(product.images && product.images.length > 0 ? product.images[0] : product.image_url) && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : product.image_url!}
                      alt={name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate">{name}</h3>
                  {product.price && product.price_before ? (
                    <div>
                      <span className="text-red-400 line-through text-sm mr-2">
                        {product.price_before.toLocaleString()}
                      </span>
                      <span className="text-green-400 font-bold text-xl">
                        {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  ) : product.price ? (
                    <p className="text-primary font-bold text-xl">
                      {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Compare Button */}
              <button
                onClick={handleCompareClick}
                className={`flex items-center gap-2 h-12 px-4 rounded-lg transition-colors ${
                  inCompare
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-primary hover:text-white'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span className="text-sm">
                  {inCompare 
                    ? (language === 'ar' ? 'إزالة من المقارنة' : 'Remove from Compare')
                    : (language === 'ar' ? 'إضافة للمقارنة' : 'Add to Compare')
                  }
                </span>
              </button>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 h-12">
                <span className="text-gray-300 text-sm">{language === 'ar' ? 'الكمية' : 'Quantity'}:</span>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-12 w-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(val, maxQuantity));
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="h-12 w-20 px-3 bg-slate-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center [text-align:center]"
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="h-12 w-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-2 h-12 px-8 rounded-lg transition-colors font-medium ${
                  inCart
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {inCart 
                    ? (language === 'ar' ? 'في السلة' : 'In Cart')
                    : (language === 'ar' ? 'إضافة للسلة' : 'Add to Cart')
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind sticky bar */}
      {!isSoldOut && <div className="h-20 md:h-24" />}
    </div>
  );
}

