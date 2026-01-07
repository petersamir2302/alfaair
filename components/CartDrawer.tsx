'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { X, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    closeCart,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    router.push('/cart');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-slate-800 shadow-xl z-[9999] transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span>{language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}</span>
            {getTotalItems() > 0 && (
              <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
                {getTotalItems()}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-300 text-lg mb-4">
                {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
              </p>
              <Link
                href="/#products"
                onClick={closeCart}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const name = language === 'ar' ? item.product.name_ar : item.product.name_en;
                const imageUrl = item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : item.product.image_url;
                const price = item.product.price ?? 0;
                const maxQuantity = item.product.inventory ?? Infinity;
                const isSoldOut = (item.product.inventory ?? 0) === 0;

                return (
                  <div
                    key={item.product.id}
                    className="bg-slate-700 rounded-lg p-4 flex gap-4"
                  >
                    {imageUrl && (
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={closeCart}
                        className="relative w-20 h-20 flex-shrink-0 bg-slate-600 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imageUrl}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={closeCart}
                        className="block"
                      >
                        <h3 className="text-white font-medium mb-1 truncate">{name}</h3>
                      </Link>
                      <p className="text-primary font-bold mb-2">
                        {price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 bg-slate-600 hover:bg-slate-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= maxQuantity || isSoldOut}
                          className="p-1 bg-slate-600 hover:bg-slate-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors ml-auto"
                          title={language === 'ar' ? 'إزالة' : 'Remove'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {item.quantity >= maxQuantity && maxQuantity !== Infinity && (
                        <p className="text-yellow-500 text-xs mt-1">
                          {language === 'ar' ? 'الحد الأقصى للمخزون' : 'Max stock reached'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                {language === 'ar' ? 'الإجمالي' : 'Total'}
              </span>
              <span className="text-white font-bold text-xl">
                {getTotalPrice().toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                {language === 'ar' ? 'مسح الكل' : 'Clear All'}
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>{t('submitOrder')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


