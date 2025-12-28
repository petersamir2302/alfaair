'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Product } from '@/lib/supabase/types';
import { ShoppingCart, Send } from 'lucide-react';

interface OrderFormProps {
  product: Product;
}

export function OrderForm({ product }: OrderFormProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    quantity: 1,
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const productName = language === 'ar' ? product.name_ar : product.name_en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName,
          productNameAr: product.name_ar,
          productNameEn: product.name_en,
          quantity: formData.quantity,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('orderError'));
      }

      setSuccess(true);
      setFormData({
        quantity: 1,
        name: '',
        phone: '',
        email: '',
        notes: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('orderError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">{t('orderNow')}</h2>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            {t('productName')}
          </label>
          <input
            type="text"
            value={productName}
            disabled
            className="w-full px-4 py-2 bg-gray-50 border border-primary/10 rounded-lg text-secondary cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            {t('quantity')}
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            required
            className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="border-t border-primary/10 pt-4">
          <h3 className="text-lg font-bold text-primary mb-4">{t('contactInfo')}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                {t('yourName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                {t('yourPhone')} *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                {t('yourEmail')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                {t('orderNotes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
    </div>
  );
}

