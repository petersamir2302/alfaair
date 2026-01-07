import { Header } from '@/components/Header';
import { ProductList } from '@/components/ProductList';
import { ProductSearchWizard } from '@/components/ProductSearchWizard';
import { ServicesSection } from '@/components/ServicesSection';
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export const metadata: Metadata = {
  title: "Home",
  description: "AlfaAir offers premium air conditioning solutions in Egypt. Browse our wide selection of AC units from top brands including Beko, Carrier, Haier, Gree, Midea, and York. Best prices, warranty, and professional installation services.",
  openGraph: {
    title: "AlfaAir - Premium Air Conditioning Solutions in Egypt",
    description: "Browse our wide selection of AC units from top brands. Best prices, warranty, and professional installation services.",
    url: siteUrl,
    images: [
      {
        url: "/hero-v2.jpeg",
        width: 1200,
        height: 630,
        alt: "AlfaAir Air Conditioning Solutions",
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  
  let { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching products:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    // If there's an error, try to fetch without the order column to see if that's the issue
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('products')
      .select('id, name_ar, name_en, created_at');
    
    if (!fallbackError && fallbackData) {
      console.log('Fallback query succeeded - issue might be with the order column or other columns');
      products = fallbackData as any; // Use fallback data temporarily
    }
  }
  
  // Sort by order and created_at (PostgREST doesn't support multiple order calls)
  const sortedProducts = products?.sort((a: any, b: any) => {
    const orderA = a.order ?? Infinity;
    const orderB = b.order ?? Infinity;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Generate structured data for homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "AlfaAir",
    "description": "Premium Air Conditioning Solutions in Egypt",
    "url": siteUrl,
    "logo": `${siteUrl}/logo-v2.png`,
    "image": `${siteUrl}/hero-v2.jpeg`,
    "telephone": "+201288215167",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EG",
      "addressLocality": "Egypt"
    },
    "sameAs": [
      // Add your social media links here when available
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "Egypt"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Air Conditioning Units",
      "itemListElement": sortedProducts?.slice(0, 10).map((product: any, index: number) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Product",
          "name": product.name_ar || product.name_en,
          "description": product.description_ar || product.description_en,
          "image": product.images?.[0] || product.image_url,
          "brand": product.brand_id ? {
            "@type": "Brand",
            "name": product.brand_id
          } : undefined,
          "offers": product.price ? {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "EGP",
            "availability": product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          } : undefined
        }
      })) || []
    }
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <div className="container mx-auto px-4 py-4 pt-20 md:py-8 md:pt-24">
        <section className="mb-6 md:mb-12">
          <div className="relative rounded-2xl overflow-hidden mb-4 md:mb-8">
            <div className="relative h-[240px] md:h-[400px]">
              <Image
                src="/hero-v2.jpeg"
                alt="AlfaAir - Premium Air Conditioning Solutions in Egypt | مكيفات وتكييف هواء في مصر"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        <ServicesSection />

        <ProductSearchWizard />

        <section id="products" className="mb-6 md:mb-12">
          <ProductList initialProducts={sortedProducts || []} />
        </section>

        <WhyChooseUsSection />

        <AboutSection />

        <ContactSection />
      </div>
    </main>
  );
}

