'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function ContactSection() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);

  const contacts = [
    {
      type: 'email',
      icon: Mail,
      qr: '/qr/mail.png',
      label: t('contactEmail'),
      value: 'alfa.air.condition.1995@gmail.com',
      link: 'mailto:alfa.air.condition.1995@gmail.com',
      color: 'bg-green-100 text-green-700',
    },
    {
      type: 'phone1',
      icon: Phone,
      qr: '/qr/tel1.png',
      label: t('phone'),
      value: '01288215167',
      link: 'tel:+201288215167',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      type: 'phone2',
      icon: Phone,
      qr: '/qr/tel2.png',
      label: t('phone'),
      value: '01020246047',
      link: 'tel:+201020246047',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      type: 'instagram',
      icon: Instagram,
      qr: '/qr/insta.png',
      label: 'Instagram',
      value: '@alfaair.eg',
      link: 'https://www.instagram.com/alfaair.eg?igsh=MXNmeXZneTc4NnpwMg==',
      color: 'bg-pink-100 text-pink-700',
    },
    {
      type: 'facebook',
      icon: Facebook,
      qr: '/qr/fb-warsha.png',
      label: 'Facebook',
      value: language === 'ar' ? 'صفحة الفيسبوك' : 'Facebook Page',
      link: 'https://www.facebook.com/share/16koecbKnS/',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      type: 'whatsapp1',
      icon: MessageCircle,
      qr: '/qr/wa1.png',
      label: 'WhatsApp',
      value: '01288215167',
      link: 'https://wa.me/+201288215167',
      color: 'bg-green-100 text-green-700',
    },
    {
      type: 'whatsapp2',
      icon: MessageCircle,
      qr: '/qr/wa2.png',
      label: 'WhatsApp',
      value: '01020246047',
      link: 'https://wa.me/+201020246047',
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <section id="contact" className="mb-16 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('getInTouch')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <div
              key={contact.type}
              className="bg-white rounded-lg p-6 shadow-md border border-primary/10 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${contact.color} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-4">{contact.label}</h3>
              
              <div className="mb-4 flex justify-center">
                <div className="relative w-32 h-32 bg-white border-2 border-primary/10 rounded-lg p-2">
                  <Image
                    src={contact.qr}
                    alt={`${contact.label} QR Code`}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              </div>

              <Link
                href={contact.link}
                target={contact.type === 'email' ? undefined : '_blank'}
                rel={contact.type === 'email' ? undefined : 'noopener noreferrer'}
                className="text-primary hover:text-primary-dark font-medium text-sm transition-colors break-all"
              >
                {contact.value}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

