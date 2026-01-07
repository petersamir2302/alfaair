'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Product } from '@/lib/supabase/types';
import { ShoppingCart, Send, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics';

interface CheckoutOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutOrderForm({ isOpen, onClose }: CheckoutOrderFormProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const hasSoldOutItems = cartItems.some(item => (item.product.inventory ?? 0) === 0);

  // Track begin_checkout when form opens
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      const items = cartItems.map((item) => ({
        id: item.product.id,
        name: language === 'ar' ? item.product.name_ar : item.product.name_en,
        price: item.product.price || undefined,
        quantity: item.quantity,
        brand: undefined,
        category: undefined,
      }));
      trackBeginCheckout(items);
    }
  }, [isOpen, cartItems.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Submit order for each cart item
      const orderPromises = cartItems.map(async (item) => {
        const productName = language === 'ar' ? item.product.name_ar : item.product.name_en;
        
        const response = await fetch('/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.product.id,
            productName,
            productNameAr: item.product.name_ar,
            productNameEn: item.product.name_en,
            quantity: item.quantity,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            notes: formData.notes,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || t('orderError'));
        }

        return response.json();
      });

      const orders = await Promise.all(orderPromises);

      // Track purchase event
      const totalValue = cartItems.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
      );
      const transactionId = orders[0]?.id || `order_${Date.now()}`;
      
      trackPurchase({
        transaction_id: transactionId,
        value: totalValue,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: language === 'ar' ? item.product.name_ar : item.product.name_en,
          price: item.product.price || undefined,
          quantity: item.quantity,
          brand: undefined,
          category: undefined,
        })),
      });

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        notes: '',
      });
      
      // Clear cart after successful order
      clearCart();
      
      // Close popup after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('orderError'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">{t('orderNow')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-3">
            {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h3>
          <div className="space-y-2">
            {cartItems.map((item) => {
              const name = language === 'ar' ? item.product.name_ar : item.product.name_en;
              const price = item.product.price ?? 0;
              const itemTotal = price * item.quantity;
              
              return (
                <div key={item.product.id} className="flex justify-between text-gray-300">
                  <span>
                    {name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {itemTotal.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {t('orderSuccess')}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {hasSoldOutItems ? (
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-white">{t('soldOut')}</p>
            <p className="text-sm text-gray-300 mt-2">
              {language === 'ar' 
                ? 'عذراً، بعض المنتجات غير متوفرة حالياً. يرجى إزالتها من السلة.'
                : 'Sorry, some products are currently out of stock. Please remove them from your cart.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-bold text-white mb-4">{t('contactInfo')}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('yourName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('yourPhone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('yourEmail')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('orderNotes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? t('sending') : t('placeOrder')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

