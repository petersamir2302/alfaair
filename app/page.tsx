import { Header } from '@/components/Header';
import { ProductList } from '@/components/ProductList';
import { ProductSearchWizard } from '@/components/ProductSearchWizard';
import { ServicesSection } from '@/components/ServicesSection';
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4 pt-20 md:py-8 md:pt-24">
        <section className="mb-6 md:mb-12">
          <div className="relative rounded-2xl overflow-hidden mb-4 md:mb-8">
            <div className="relative h-[240px] md:h-[400px]">
              <Image
                src="/hero-v2.jpeg"
                alt="AlfaAir Hero"
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
          <ProductList initialProducts={products || []} />
        </section>

        <WhyChooseUsSection />

        <AboutSection />

        <ContactSection />
      </div>
    </main>
  );
}

