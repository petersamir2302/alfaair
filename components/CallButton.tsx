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

  // Primary phone number
  const phoneNumber = '+201288215167';
  const telUrl = `tel:${phoneNumber}`;

  return (
    <Link
      href={telUrl}
      className="fixed bottom-6 left-4 md:bottom-8 md:left-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Call us"
    >
      <Phone className="w-7 h-7 md:w-8 md:h-8 text-white" />
    </Link>
  );
}

