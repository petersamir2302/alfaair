'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Users, Shield, Headphones, UserCheck } from 'lucide-react';

export function WhyChooseUsSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  const features = [
    {
      icon: UserCheck,
      title: t('customers'),
      description: t('customersDesc'),
      number: t('customersCount'),
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      icon: Users,
      title: t('expertise'),
      description: t('expertiseDesc'),
      number: t('expertiseYears'),
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: Shield,
      title: t('warrantyTitle'),
      description: t('warrantyDesc'),
      number: t('warrantyYears'),
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      icon: Headphones,
      title: t('support'),
      description: t('supportDesc'),
      number: t('support247'),
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <section id="why-choose-us" className="mb-8 md:mb-16 py-6 md:py-12 bg-slate-800/50 rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('whyChooseUs')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-4 md:p-6 transition-all duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{feature.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

