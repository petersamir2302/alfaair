import { Header } from '@/components/Header';
import { ProductList } from '@/components/ProductList';
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
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-primary/10 mb-8">
            <div className="relative h-[320px] md:h-[400px]">
              <Image
                src="/hero.jpeg"
                alt="AlfaAir Hero"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <ServicesSection />

        <section id="products" className="mb-12">
          <ProductList initialProducts={products || []} />
        </section>

        <WhyChooseUsSection />

        <AboutSection />

        <ContactSection />
      </div>
    </main>
  );
}

