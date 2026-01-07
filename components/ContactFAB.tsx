'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, Facebook, X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export function ContactFAB() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const iconIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Contact information
  const phoneNumber = '+201288215167';
  const whatsappNumber = '+201288215167';
  const whatsappMessage = encodeURIComponent('شفت موقعكم وعايز أسأل عن حاجة');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const telUrl = `tel:${phoneNumber}`;
  const facebookUrl = 'https://www.facebook.com/share/16koecbKnS/';

  // Contact options configuration - only phone, WhatsApp, and Facebook
  const contactOptions = [
    {
      id: 'whatsapp',
      icon: WhatsAppIcon,
      href: whatsappUrl,
      label: 'WhatsApp',
      bgColor: 'bg-green-500 hover:bg-green-600',
      delay: 0,
      angle: -15, // degrees - top-left (even spacing)
      distance: 110, // pixels from center
    },
    {
      id: 'phone',
      icon: Phone,
      href: telUrl,
      label: 'Call us',
      bgColor: 'bg-teal-500 hover:bg-teal-600',
      delay: 50,
      angle: -45, // degrees - top-left (even spacing)
      distance: 110,
    },
    {
      id: 'facebook',
      icon: Facebook,
      href: facebookUrl,
      label: 'Facebook',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      delay: 100,
      angle: -75, // degrees - top-left (even spacing)
      distance: 110,
    },
  ];

  // Icons for cycling animation with colors
  const cycleIcons = [
    { Icon: WhatsAppIcon, label: 'WhatsApp', bgColor: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { Icon: Phone, label: 'Phone', bgColor: 'bg-teal-500', hoverColor: 'hover:bg-teal-600' },
    { Icon: Facebook, label: 'Facebook', bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
  ];

  // Cycle through icons with shaking animation when closed
  useEffect(() => {
    if (!isOpen) {
      iconIntervalRef.current = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => {
          setCurrentIconIndex((prev) => (prev + 1) % cycleIcons.length);
          setIsShaking(false);
        }, 300); // Shake duration (matches animation duration)
      }, 3000); // Change icon every 3 seconds
    } else {
      if (iconIntervalRef.current) {
        clearInterval(iconIntervalRef.current);
        iconIntervalRef.current = null;
      }
    }

    return () => {
      if (iconIntervalRef.current) {
        clearInterval(iconIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Calculate position for each contact option button
  const getButtonPosition = (angle: number, distance: number) => {
    const radians = (angle * Math.PI) / 180;
    const x = Math.sin(radians) * distance;
    const y = -Math.cos(radians) * distance;
    return {
      transform: isOpen 
        ? `translate(${x}px, ${y}px) scale(1)` 
        : 'translate(0, 0) scale(0)',
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
    };
  };

  const CurrentIcon = cycleIcons[currentIconIndex].Icon;
  const currentFabColor = isOpen 
    ? 'bg-blue-500 hover:bg-blue-600' 
    : `${cycleIcons[currentIconIndex].bgColor} ${cycleIcons[currentIconIndex].hoverColor}`;

  return (
    <div 
      ref={fabRef}
      className={`fixed ${bottomClass} right-4 md:right-6 z-50`}
      style={{ 
        width: 'fit-content',
        height: 'fit-content',
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}
    >
      {/* Contact option buttons */}
      {contactOptions.map((option) => {
        const Icon = option.icon;
        const position = getButtonPosition(option.angle, option.distance);
        
        return (
          <Link
            key={option.id}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full ${option.bgColor} shadow-lg transition-all duration-300 ease-out`}
            style={{
              ...position,
              transitionDelay: isOpen ? `${option.delay}ms` : '0ms',
            }}
            aria-label={option.label}
            onClick={() => setIsOpen(false)}
          >
            {option.id === 'facebook' ? (
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white flex-shrink-0" />
            ) : (
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
            )}
          </Link>
        );
      })}

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 ${currentFabColor} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isShaking ? 'animate-shake' : ''
        }`}
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-7 h-7 md:w-8 md:h-8 text-white" />
        ) : (
          <CurrentIcon className={`w-7 h-7 md:w-8 md:h-8 text-white transition-all duration-200 ${
            isShaking ? 'scale-110' : 'scale-100'
          }`} />
        )}
      </button>
    </div>
  );
}
