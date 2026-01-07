'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useCompare } from './CompareProvider';
import { useFavorites } from './FavoriteProvider';
import { useCart } from './CartProvider';
import { CartDrawer } from './CartDrawer';
import { Home, Package, Wrench, Info, Phone, Scale, ShoppingCart, BookOpen, Heart, Menu, X } from 'lucide-react';

export function Header() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const { compareItems } = useCompare();
  const { favoriteItems } = useFavorites();
  const { getTotalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = language === 'ar';
  const compareCount = compareItems.length;
  const favoriteCount = favoriteItems.length;
  const cartCount = getTotalItems();

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/#services', icon: Wrench, label: t('services') },
    { href: '/#products', icon: Package, label: t('products') },
    { href: '/#about', icon: Info, label: t('aboutUs') },
    { href: '/blog', icon: BookOpen, label: t('blog') },
    { href: '/#contact', icon: Phone, label: t('contactUs') },
  ];

  return (
    <>
      <CartDrawer />
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
                
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-black hover:bg-white/90 transition-all duration-200 font-medium text-sm"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <Link 
                    href="/favorites" 
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-black hover:bg-white/90 transition-all duration-200 font-medium text-sm"
                  >
                    <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
                    <span>{isRTL ? 'مفضلة' : 'Favorites'}</span>
                    {favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {favoriteCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/compare" 
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-black hover:bg-white/90 transition-all duration-200 font-medium text-sm"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isRTL ? 'مقارنة' : 'Compare'}</span>
                    {compareCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={openCart}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/40 text-white border-2 border-primary/50 hover:border-primary transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-bold">{isRTL ? 'السلة' : 'Cart'}</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <div className="pl-2 border-r border-primary/20 h-6"></div>
                  <LanguageSwitcher />
                </nav>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 lg:hidden">
                  <Link 
                    href="/favorites" 
                    className="relative p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
                    {favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {favoriteCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/compare" 
                    className="relative p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Scale className="w-5 h-5" />
                    {compareCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={openCart}
                    className="relative p-2 rounded-lg bg-primary/20 hover:bg-primary/40 text-white border-2 border-primary/50 hover:border-primary transition-all duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <LanguageSwitcher />
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-black hover:bg-white/90 transition-all duration-200 font-medium text-sm"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <Link 
                    href="/favorites" 
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-black hover:bg-white/90 transition-all duration-200 font-medium text-sm"
                  >
                    <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
                    <span>{isRTL ? 'مفضلة' : 'Favorites'}</span>
                    {favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {favoriteCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/compare" 
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-black hover:bg-white/90 transition-all duration-200 font-medium text-sm"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isRTL ? 'مقارنة' : 'Compare'}</span>
                    {compareCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={openCart}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/40 text-white border-2 border-primary/50 hover:border-primary transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-bold">{isRTL ? 'السلة' : 'Cart'}</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <div className="pl-2 border-l border-primary/20 h-6"></div>
                  <LanguageSwitcher />
                </nav>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 lg:hidden">
                  <LanguageSwitcher />
                  <Link 
                    href="/favorites" 
                    className="relative p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
                    {favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {favoriteCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/compare" 
                    className="relative p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Scale className="w-5 h-5" />
                    {compareCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {compareCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={openCart}
                    className="relative p-2 rounded-lg bg-primary/20 hover:bg-primary/40 text-white border-2 border-primary/50 hover:border-primary transition-all duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
                
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

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-[73px] ${isRTL ? 'right-0' : 'left-0'} w-full bg-gradient-to-b from-[#2E5C8A] to-[#4A90E2] shadow-xl border-b border-primary/20 transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
          style={{ maxHeight: mobileMenuOpen ? 'calc(100vh - 73px)' : '0', overflow: 'hidden' }}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:text-primary-lighter hover:bg-white/20 transition-all duration-200 font-medium"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-primary/20 my-2"></div>
            <Link
              href="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:text-primary-lighter hover:bg-white/20 transition-all duration-200 font-medium"
            >
              <Heart className={`w-5 h-5 flex-shrink-0 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
              <span>{isRTL ? 'مفضلة' : 'Favorites'}</span>
              {favoriteCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:text-primary-lighter hover:bg-white/20 transition-all duration-200 font-medium"
            >
              <Scale className="w-5 h-5 flex-shrink-0" />
              <span>{isRTL ? 'مقارنة' : 'Compare'}</span>
              {compareCount > 0 && (
                <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
                  {compareCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

