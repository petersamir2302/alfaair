'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Home } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  // Don't show breadcrumbs on home page
  if (pathname === '/') return null;

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: language === 'ar' ? 'الرئيسية' : 'Home', href: '/' }
    ];

    const segments = pathname.split('/').filter(Boolean);

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      let label = segment;

      // Translate common segments
      if (segment === 'admin') {
        label = t('admin');
      } else if (segment === 'products') {
        label = t('products');
      } else if (segment === 'brands') {
        label = t('brands');
      } else if (segment === 'categories') {
        label = t('categories');
      } else if (segment === 'new') {
        label = language === 'ar' ? 'جديد' : 'New';
      } else if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // UUID - skip or show "Edit"
        label = language === 'ar' ? 'تعديل' : 'Edit';
      } else {
        // Capitalize first letter
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      items.push({ label, href });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center gap-2 mb-4 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index === 0 ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ) : (
            <>
              <span className="text-gray-500">/</span>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );
}

