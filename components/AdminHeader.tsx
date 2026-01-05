'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LogOut, Package, LayoutDashboard } from 'lucide-react';

export function AdminHeader() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
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
            <span className="text-lg font-semibold text-primary ml-2">{t('admin')}</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('dashboard')}</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-primary-lighter hover:bg-white/60 transition-all duration-200 font-medium text-sm"
            >
              <Package className="w-4 h-4" />
              <span>{t('products')}</span>
            </Link>
            <div className="pl-2 border-r border-primary/20 h-6"></div>
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

