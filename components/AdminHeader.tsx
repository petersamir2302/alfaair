'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LogOut, Package, LayoutDashboard, Tag, FolderTree, ExternalLink, ShoppingCart, BookOpen, Menu, X } from 'lucide-react';

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = language === 'ar';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/admin/products', icon: Package, label: t('products') },
    { href: '/admin/brands', icon: Tag, label: t('brands') },
    { href: '/admin/categories', icon: FolderTree, label: t('categories') },
    { href: '/admin/orders', icon: ShoppingCart, label: t('orders') },
    { href: '/admin/blog', icon: BookOpen, label: language === 'ar' ? 'المدونة' : 'Blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md shadow-lg border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-v2.png"
              alt="AlfaAir"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="text-lg font-semibold text-primary ml-2 hidden sm:inline">{t('admin')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    isActive(item.href)
                      ? 'text-primary-lighter bg-white/60'
                      : 'text-white hover:text-primary-lighter hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pl-2 border-r border-primary/20 h-6"></div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{language === 'ar' ? 'الموقع' : 'View Site'}</span>
            </a>
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.href)
                    ? 'text-primary-lighter bg-white/60'
                    : 'text-white hover:text-primary-lighter hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="border-t border-primary/20 my-2"></div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:text-primary-lighter hover:bg-white/20 transition-all duration-200 font-medium"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            <span>{language === 'ar' ? 'الموقع' : 'View Site'}</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 font-medium mt-2"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>{t('logout')}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

