import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductViewTracker } from '@/components/ProductViewTracker';
import type { Metadata } from 'next';
import { orgId } from '@/lib/seo';

async function getBrandName(supabase: any, brandId: string | null) {
  if (!brandId) return undefined;
  const { data } = await supabase.from('brands').select('name_ar, name_en').eq('id', brandId).single();
  return data ? (data.name_en || data.name_ar) as string : undefined;
}

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
  const productDescriptionAr = product.description_ar || `شراء ${productName} - مكيف هواء من AlfaAir. أفضل الأسعار مع ضمان شامل.`;
  const productDescriptionEn = product.description_en || `Buy ${productName} - Premium air conditioning unit from AlfaAir. Best prices and warranty included.`;
  const productDescription = `${productDescriptionAr} ${productDescriptionEn}`;
  const productImage = product.images?.[0] || product.image_url || '/logo-v2.png';
  const productUrl = `${siteUrl}/products/${id}`;
  const price = product.price ? `${product.price} EGP` : undefined;
  const brand = await getBrandName(supabase, product.brand_id);

  return {
    title: `${productName} | شراء من موقع بيع تكييفات AlfaAir`,
    description: productDescription,
    keywords: [
      productName,
      "شراء تكييف",
      "بيع تكييفات",
      "موقع بيع تكييفات",
      "مكيف للبيع",
      "تكييف للبيع",
      "air conditioning",
      "AC unit",
      "مكيف",
      "تكييف",
      brand || "",
      "Egypt",
      "AlfaAir",
      "buy AC online"
    ].filter(Boolean),
    openGraph: {
      title: `${productName} | شراء من موقع بيع تكييفات AlfaAir`,
      description: productDescription,
      url: productUrl,
      type: "website",
      siteName: "AlfaAir",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
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
  const brand = await getBrandName(supabase, product.brand_id);
  const productUrl = `${siteUrl}/products/${id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "alternateName": product.name_en && product.name_en !== productName ? product.name_en : undefined,
    "url": productUrl,
    "description": productDescription || `${productName} - تكييف ${brand || ''} ${product.power_hp ? product.power_hp + ' حصان' : ''} متاح للبيع في AlfaAir مصر مع ضمان وخدمة تركيب.`.replace(/\s+/g, ' '),
    "image": productImage ? [productImage] : [],
    "brand": brand ? {
      "@type": "Brand",
      "name": brand
    } : undefined,
    "offers": product.price ? {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "EGP",
      "itemCondition": "https://schema.org/NewCondition",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inventory && product.inventory > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": { "@id": orgId }
    } : undefined,
    "additionalProperty": [
      product.coverage_area_sqm && {
        "@type": "PropertyValue",
        "name": "Coverage area",
        "value": `${product.coverage_area_sqm} m²`
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "AlfaAir", "item": siteUrl },
            { "@type": "ListItem", "position": 2, "name": "التكييفات", "item": `${siteUrl}/#products` },
            { "@type": "ListItem", "position": 3, "name": productName, "item": productUrl },
          ],
        }) }}
      />
      <ProductViewTracker product={product} />
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24">
        <ProductDetail product={product} />
      </div>
    </main>
  );
}

