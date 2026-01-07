import { Header } from '@/components/Header';
import { CompareView } from '@/components/CompareView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare air conditioning units side by side to find the best option for your needs.",
  robots: {
    index: false,
    follow: false,
  },
};

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


