import { Header } from '@/components/Header';
import { CompareView } from '@/components/CompareView';

export default function ComparePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <CompareView />
      </div>
    </main>
  );
}

