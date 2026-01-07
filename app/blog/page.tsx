import { Header } from '@/components/Header';
import { BlogList } from '@/components/BlogList';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export const metadata: Metadata = {
  title: "Blog - AC Tips & Guides",
  description: "Expert tips, guides, and articles about air conditioning in Egypt. Learn about AC maintenance, energy saving, buying guides, and more.",
  openGraph: {
    title: "AlfaAir Blog - AC Tips & Guides",
    description: "Expert tips and guides about air conditioning in Egypt",
    url: `${siteUrl}/blog`,
    type: "website",
    siteName: "AlfaAir",
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <BlogList />
      </div>
    </main>
  );
}

