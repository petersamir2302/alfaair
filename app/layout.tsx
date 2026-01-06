import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CompareProvider } from "@/components/CompareProvider";
import { CartProvider } from "@/components/CartProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CallButton } from "@/components/CallButton";
import { Loader } from "@/components/Loader";
import { Cairo } from "next/font/google";
import { Suspense } from "react";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "AlfaAir - AC Trading Company",
  description: "Premium Air Conditioning Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`light scroll-smooth ${cairo.variable}`}>
      <body className="text-gray-900 font-sans">
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

