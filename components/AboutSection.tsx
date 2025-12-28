'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import Image from 'next/image';

export function AboutSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  return (
    <section id="about" className="mb-16 py-12">
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-primary/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="AlfaAir"
                width={200}
                height={67}
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('aboutUs')}</h2>
          </div>
          <p className="text-lg text-secondary text-center leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>
      </div>
    </section>
  );
}


