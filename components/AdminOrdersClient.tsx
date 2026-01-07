'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Breadcrumbs } from './Breadcrumbs';
import { BackButton } from './BackButton';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface Order {
  id: string;
  product_id: string | null;
  product_name_ar: string;
  product_name_en: string;
  quantity: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string | null;
  email_sent: boolean;
  created_at: string;
}

interface AdminOrdersClientProps {
  orders: Order[];
}

export function AdminOrdersClient({ orders: initialOrders }: AdminOrdersClientProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const [searchTerm, setSearchTerm] = useState('');

  const isRTL = language === 'ar';

  const filteredOrders = initialOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.customer_name.toLowerCase().includes(searchLower) ||
      order.customer_phone.includes(searchLower) ||
      order.customer_email.toLowerCase().includes(searchLower) ||
      order.product_name_ar.toLowerCase().includes(searchLower) ||
      order.product_name_en.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">{t('orders')}</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('orderDate')}
                </th>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('productName')}
                </th>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('quantity')}
                </th>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('customerName')}
                </th>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('customerPhone')}
                </th>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('customerEmail')}
                </th>
                <th className={`px-4 py-3 text-sm font-semibold text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('notes')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-secondary">
                    {t('noOrders')}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-primary/10 hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3 text-secondary">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">
                        {language === 'ar' ? order.product_name_ar : order.product_name_en}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary font-semibold">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {order.customer_phone}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {order.customer_email}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {order.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

