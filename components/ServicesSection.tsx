'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Wrench, Settings, Toolbox, Building2 } from 'lucide-react';
import Image from 'next/image';

export function ServicesSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  const services = [
    {
      icon: Building2,
      title: t('foundation'),
      description: t('foundationDesc'),
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      icon: Settings,
      title: t('installation'),
      description: t('installationDesc'),
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      icon: Wrench,
      title: t('maintenance'),
      description: t('maintenanceDesc'),
      color: 'bg-green-100 text-green-700 border-green-200',
    },
    {
      icon: Toolbox,
      title: t('repair'),
      description: t('repairDesc'),
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
  ];

  return (
    <section id="services" className="mb-16 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">{t('ourServices')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* AlfaAir Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-primary/10 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="AlfaAir"
                width={200}
                height={67}
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">AlfaAir</h3>
            <p className="text-secondary text-lg">
              {language === 'ar' 
                ? 'شركة رائدة في تجارة أجهزة التكييف عالية الجودة'
                : 'Leading company in trading high-quality air conditioning units'}
            </p>
          </div>

          {/* Al Warsha Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-primary/10 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Image
                src="/warsha.png"
                alt="Al Warsha"
                width={200}
                height={100}
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">{t('alWarsha')}</h3>
            <p className="text-secondary text-lg">{t('alWarshaDescription')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/30"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.color} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-secondary text-sm">{service.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

