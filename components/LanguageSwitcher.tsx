'use client';

import { useLanguage } from './LanguageProvider';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 hover:bg-white text-primary-dark hover:text-primary-dark transition-all duration-200 font-medium backdrop-blur-sm border-2 border-primary hover:border-primary-dark shadow-lg"
      aria-label="Switch language"
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'ar' ? 'EN' : 'AR'}</span>
    </button>
  );
}

