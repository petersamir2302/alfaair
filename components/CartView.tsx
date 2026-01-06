'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { BackButton } from './BackButton';
import { Breadcrumbs } from './Breadcrumbs';
import { X, Plus, Minus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function CartView() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div>
        <Breadcrumbs />
        <BackButton />
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-4">
            {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
          </p>
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>{language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    // Redirect to checkout or process order
    // For now, we'll use the existing order API for each item
    try {
      // You can implement checkout logic here
      // For now, just show a message
      alert(language === 'ar' 
        ? 'سيتم إرسال طلبك قريباً. شكراً لك!'
        : 'Your order will be processed soon. Thank you!'
      );
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
        </h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const name = language === 'ar' ? item.product.name_ar : item.product.name_en;
            const imageUrl = item.product.images && item.product.images.length > 0
              ? item.product.images[0]
              : item.product.image_url;
            const price = item.product.price ?? 0;
            const maxQuantity = item.product.inventory ?? Infinity;
            const isSoldOut = (item.product.inventory ?? 0) === 0;
            const itemTotal = price * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-slate-800 rounded-lg p-6 flex flex-col md:flex-row gap-4"
              >
                {imageUrl && (
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative w-full md:w-32 h-32 flex-shrink-0 bg-slate-700 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                )}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="block mb-2"
                  >
                    <h3 className="text-white font-bold text-lg hover:text-primary transition-colors">
                      {name}
                    </h3>
                  </Link>
                  <p className="text-primary font-bold text-xl mb-4">
                    {price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-gray-300 text-sm">
                      {language === 'ar' ? 'الكمية' : 'Quantity'}:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-medium w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= maxQuantity || isSoldOut}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {item.quantity >= maxQuantity && maxQuantity !== Infinity && (
                      <span className="text-yellow-500 text-xs">
                        {language === 'ar' ? 'الحد الأقصى' : 'Max stock'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {language === 'ar' ? 'الإجمالي' : 'Subtotal'}:
                    </span>
                    <span className="text-white font-bold text-lg">
                      {itemTotal.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors self-start"
                  title={language === 'ar' ? 'إزالة' : 'Remove'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">
              {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-gray-300">
                <span>{language === 'ar' ? 'عدد المنتجات' : 'Items'}</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>{language === 'ar' ? 'الإجمالي الفرعي' : 'Subtotal'}</span>
                <span>{getTotalPrice().toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between text-white font-bold text-xl">
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span>{getTotalPrice().toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{loading ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') : (language === 'ar' ? 'إتمام الطلب' : 'Checkout')}</span>
            </button>

            <Link
              href="/#products"
              className="block mt-4 text-center text-gray-300 hover:text-white transition-colors text-sm"
            >
              {language === 'ar' ? '← متابعة التسوق' : '← Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

