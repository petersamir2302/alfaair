'use client';

import { Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CallButton() {
  const pathname = usePathname();
  
  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Check if we're on a product detail page (where sticky bottom bar appears)
  const isProductPage = pathname?.startsWith('/products/');
  
  // Adjust bottom position when sticky bar is visible
  const bottomClass = isProductPage 
    ? 'bottom-24 md:bottom-28' // Higher when sticky bar is present
    : 'bottom-6 md:bottom-8'; // Normal position

  // Primary phone number
  const phoneNumber = '+201288215167';
  const telUrl = `tel:${phoneNumber}`;

  return (
    <Link
      href={telUrl}
      className={`fixed ${bottomClass} left-4 md:left-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
      aria-label="Call us"
    >
      <Phone className="w-7 h-7 md:w-8 md:h-8 text-white" />
    </Link>
  );
}

