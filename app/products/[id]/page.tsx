import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { ProductDetail } from '@/components/ProductDetail';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const productName = product.name_ar || product.name_en;
  const productDescription = product.description_ar || product.description_en || `Buy ${productName} - Premium air conditioning unit from AlfaAir. Best prices and warranty included.`;
  const productImage = product.images?.[0] || product.image_url || '/logo-v2.png';
  const productUrl = `${siteUrl}/products/${id}`;
  const price = product.price ? `${product.price} EGP` : undefined;

  return {
    title: productName,
    description: productDescription,
    keywords: [
      productName,
      "air conditioning",
      "AC unit",
      "مكيف",
      "تكييف",
      product.brand_id || "",
      "Egypt",
      "AlfaAir"
    ].filter(Boolean),
    openGraph: {
      title: `${productName} | AlfaAir`,
      description: productDescription,
      url: productUrl,
      type: "product",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
      ...(price && {
        siteName: "AlfaAir",
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: productDescription,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
  }

  if (!product || error) {
    notFound();
  }

  // Generate structured data for product
  const productName = product.name_ar || product.name_en;
  const productDescription = product.description_ar || product.description_en;
  const productImage = product.images?.[0] || product.image_url;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDescription,
    "image": productImage ? [productImage] : [],
    "brand": product.brand_id ? {
      "@type": "Brand",
      "name": product.brand_id
    } : undefined,
    "offers": product.price ? {
      "@type": "Offer",
      "url": `${siteUrl}/products/${id}`,
      "priceCurrency": "EGP",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inventory && product.inventory > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "AlfaAir"
      }
    } : undefined,
    "aggregateRating": product.best_seller ? {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "50"
    } : undefined,
    "additionalProperty": [
      product.power_hp && {
        "@type": "PropertyValue",
        "name": "Power",
        "value": `${product.power_hp} HP`
      },
      product.color && {
        "@type": "PropertyValue",
        "name": "Color",
        "value": product.color
      },
      product.warranty_years && {
        "@type": "PropertyValue",
        "name": "Warranty",
        "value": `${product.warranty_years} years`
      },
      product.cold && {
        "@type": "PropertyValue",
        "name": "Cooling",
        "value": "Yes"
      },
      product.hot && {
        "@type": "PropertyValue",
        "name": "Heating",
        "value": "Yes"
      },
      product.inverter && {
        "@type": "PropertyValue",
        "name": "Inverter Technology",
        "value": "Yes"
      },
      product.smart && {
        "@type": "PropertyValue",
        "name": "Smart Features",
        "value": "Yes"
      }
    ].filter(Boolean)
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <ProductDetail product={product} />
      </div>
    </main>
  );
}

