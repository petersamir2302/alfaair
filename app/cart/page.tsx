import { Header } from '@/components/Header';
import { CartView } from '@/components/CartView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected air conditioning units and proceed to checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <CartView />
      </div>
    </main>
  );
}


