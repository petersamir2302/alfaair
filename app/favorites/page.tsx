import { Header } from '@/components/Header';
import { FavoritesView } from '@/components/FavoritesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Favorite Products",
  description: "View your favorite air conditioning units.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <FavoritesView />
      </div>
    </main>
  );
}

