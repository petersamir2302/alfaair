'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';

interface AdminPageHeaderProps {
  titleKey: keyof typeof import('@/lib/i18n').translations.ar;
}

export function AdminPageHeader({ titleKey }: AdminPageHeaderProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  return (
    <h1 className="text-3xl font-bold text-primary mb-6">{t(titleKey)}</h1>
  );
}


