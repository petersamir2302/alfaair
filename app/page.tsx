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
import { FaqSection } from '@/components/FaqSection';
import { faqSchema, orgId } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export const metadata: Metadata = {
  title: "موقع بيع تكييفات في مصر - AlfaAir | متجر تكييفات أونلاين",
  description: "موقع بيع تكييفات في مصر - AlfaAir متجر تكييفات أونلاين مع أفضل الأسعار. مكيفات من بيكو، كاريير، هاير، جري، ميديا، يورك. ضمان شامل وخدمة تركيب احترافية. AlfaAir offers premium air conditioning solutions in Egypt. Browse our wide selection of AC units from top brands including Beko, Carrier, Haier, Gree, Midea, and York. Best prices, warranty, and professional installation services.",
  keywords: [
    "موقع بيع تكييفات",
    "بيع تكييفات",
    "شراء تكييف",
    "متجر تكييفات",
    "تكييفات للبيع",
    "مكيفات للبيع",
    "موقع تكييفات",
    "شراء مكيفات",
    "تكييفات مصر",
    "مكيفات مصر",
    "تكييفات أونلاين",
    "مكيفات أونلاين"
  ],
  openGraph: {
    title: "AlfaAir - موقع بيع تكييفات في مصر | متجر تكييفات أونلاين",
    description: "موقع بيع تكييفات في مصر - متجر تكييفات أونلاين مع أفضل الأسعار. مكيفات من بيكو، كاريير، هاير، جري، ميديا، يورك. ضمان شامل وخدمة تركيب احترافية. Browse our wide selection of AC units from top brands. Best prices, warranty, and professional installation services.",
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

  // Brand names (products only store brand_id, which is meaningless to search engines / AI)
  const { data: brands } = await supabase.from('brands').select('id, name_ar, name_en');
  const brandName = (id: string | null) => {
    const b = brands?.find((x: any) => x.id === id);
    return b ? (b.name_en || b.name_ar) : undefined;
  };

  // Catalog of what AlfaAir sells, linked to the site-wide Organization entity
  const catalogStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "تكييفات للبيع من AlfaAir | Air conditioners for sale at AlfaAir",
    "url": siteUrl,
    "numberOfItems": sortedProducts?.length || 0,
    "itemListElement": (sortedProducts || []).slice(0, 30).map((product: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${siteUrl}/products/${product.id}`,
      "item": {
        "@type": "Product",
        "name": product.name_ar || product.name_en,
        "alternateName": product.name_en || undefined,
        "url": `${siteUrl}/products/${product.id}`,
        "image": product.images?.[0] || product.image_url || undefined,
        "brand": brandName(product.brand_id) ? { "@type": "Brand", "name": brandName(product.brand_id) } : undefined,
        "offers": product.price ? {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "EGP",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": { "@id": orgId }
        } : undefined
      }
    }))
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
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

        <FaqSection />

        <ContactSection />
      </div>
    </main>
  );
}

