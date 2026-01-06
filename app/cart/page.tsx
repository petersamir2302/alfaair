import { Header } from '@/components/Header';
import { CartView } from '@/components/CartView';

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

