'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Breadcrumbs } from './Breadcrumbs';
import { BackButton } from './BackButton';

interface AdminPageHeaderProps {
  titleKey: keyof typeof import('@/lib/i18n').translations.ar;
}

export function AdminPageHeader({ titleKey }: AdminPageHeaderProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  return (
    <div>
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-3xl font-bold text-primary mb-6">{t(titleKey)}</h1>
    </div>
  );
}



