'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useCompare } from './CompareProvider';
import { useCart } from './CartProvider';
import { CartDrawer } from './CartDrawer';
import { Home, Package, Wrench, Info, Phone, Scale, ShoppingCart } from 'lucide-react';

export function Header() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { compareItems } = useCompare();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isRTL = language === 'ar';
  const compareCount = compareItems.length;
  const cartCount = getTotalItems();

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md shadow-lg border-b border-primary/20">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex items-center justify-between">
          {isRTL ? (
            <>
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                  src="/logo-v2.png"
                  alt="AlfaAir - AC Trading Company Logo"
                  width={180}
                  height={60}
                  className="h-14 md:h-16 w-auto"
                  priority
                />
              </Link>
              
              <nav className="flex items-center gap-2">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">{t('home')}</span>
                </Link>
                <Link 
                  href="/#services" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden md:inline">{t('services')}</span>
                </Link>
                <Link 
                  href="/#products" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline">{t('products')}</span>
                </Link>
                <Link 
                  href="/#about" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden md:inline">{t('aboutUs')}</span>
                </Link>
                <Link 
                  href="/#contact" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden md:inline">{t('contactUs')}</span>
                </Link>
                <Link 
                  href="/compare" 
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Scale className="w-4 h-4" />
                  <span className="hidden md:inline">{isRTL ? 'مقارنة' : 'Compare'}</span>
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden md:inline">{isRTL ? 'السلة' : 'Cart'}</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <div className="pl-2 border-r border-primary/20 h-6"></div>
                <LanguageSwitcher />
              </nav>
            </>
          ) : (
            <>
              <nav className="flex items-center gap-2">
                <LanguageSwitcher />
                <div className="pr-2 border-l border-primary/20 h-6"></div>
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">{t('home')}</span>
                </Link>
                <Link 
                  href="/#services" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden md:inline">{t('services')}</span>
                </Link>
                <Link 
                  href="/#products" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline">{t('products')}</span>
                </Link>
                <Link 
                  href="/#about" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden md:inline">{t('aboutUs')}</span>
                </Link>
                <Link 
                  href="/#contact" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden md:inline">{t('contactUs')}</span>
                </Link>
                <Link 
                  href="/compare" 
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <Scale className="w-4 h-4" />
                  <span className="hidden md:inline">{isRTL ? 'مقارنة' : 'Compare'}</span>
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden md:inline">{isRTL ? 'السلة' : 'Cart'}</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </nav>
              
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                  src="/logo-v2.png"
                  alt="AlfaAir - AC Trading Company Logo"
                  width={180}
                  height={60}
                  className="h-14 md:h-16 w-auto"
                  priority
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

