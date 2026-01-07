import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CompareProvider } from "@/components/CompareProvider";
import { CartProvider } from "@/components/CartProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CallButton } from "@/components/CallButton";
import { Loader } from "@/components/Loader";
import { GoogleTagManager, GoogleTagManagerNoscript } from "@/components/GoogleTagManager";
import { Cairo } from "next/font/google";
import { Suspense } from "react";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

// Get site URL from environment variable or use default
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AlfaAir - AC Trading Company | Premium Air Conditioning Solutions",
    template: "%s | AlfaAir"
  },
  description: "AlfaAir offers premium air conditioning solutions in Egypt. Browse our wide selection of AC units from top brands including Beko, Carrier, Haier, Gree, Midea, and York. Best prices, warranty, and professional installation services.",
  keywords: [
    "air conditioning",
    "AC units",
    "air conditioner Egypt",
    "مكيفات",
    "تكييف",
    "Beko AC",
    "Carrier AC",
    "Haier AC",
    "Gree AC",
    "Midea AC",
    "York AC",
    "inverter AC",
    "smart AC",
    "AC installation",
    "AC maintenance"
  ],
  authors: [{ name: "AlfaAir" }],
  creator: "AlfaAir",
  publisher: "AlfaAir",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "AlfaAir",
    title: "AlfaAir - AC Trading Company | Premium Air Conditioning Solutions",
    description: "Premium air conditioning solutions in Egypt. Browse our wide selection of AC units from top brands. Best prices, warranty, and professional installation services.",
    images: [
      {
        url: "/logo-v2.png",
        width: 1200,
        height: 630,
        alt: "AlfaAir Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlfaAir - AC Trading Company",
    description: "Premium Air Conditioning Solutions in Egypt",
    images: ["/logo-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ar-EG": siteUrl,
      "en-US": `${siteUrl}?lang=en`,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "Air Conditioning & HVAC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`light scroll-smooth ${cairo.variable}`}>
      <body className="text-gray-900 font-sans">
        <GoogleTagManager />
        <GoogleTagManagerNoscript />
        <LanguageProvider>
          <CompareProvider>
            <CartProvider>
              <Suspense fallback={null}>
                <Loader />
              </Suspense>
              {children}
              <WhatsAppButton />
              <CallButton />
            </CartProvider>
          </CompareProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

