'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export function BackButton() {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{language === 'ar' ? 'العودة' : 'Back'}</span>
    </button>
  );
}


