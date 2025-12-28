import Link from 'next/link';
import { Header } from '@/components/Header';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16 pt-24 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-secondary mb-8">الصفحة غير موجودة</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </main>
  );
}

