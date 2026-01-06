'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function Loader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPathnameRef = useRef(pathname);
  const isNavigatingRef = useRef(false);

  // Show loader immediately when navigation starts (link clicked)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external links, mailto, tel, hash-only links, and download links
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        (href.startsWith('#') && href.length > 1) ||
        link.hasAttribute('download')
      ) {
        return;
      }
      
      // Skip external links (different origin)
      if (href.startsWith('http')) {
        try {
          const url = new URL(href);
          if (url.origin !== window.location.origin) {
            return;
          }
        } catch {
          return;
        }
      }
      
      // Get current pathname
      const currentPath = currentPathnameRef.current;
      
      // Determine target pathname
      let targetPath: string;
      try {
        if (href.startsWith('http')) {
          const url = new URL(href);
          targetPath = url.pathname;
        } else {
          // Relative URL
          const baseUrl = new URL(window.location.href);
          const resolvedUrl = new URL(href, baseUrl);
          targetPath = resolvedUrl.pathname;
        }
        
        // Only show loader for navigation to different paths
        if (targetPath !== currentPath) {
          isNavigatingRef.current = true;
          setLoading(true);
        }
      } catch (error) {
        // If URL parsing fails, check if it's a simple relative path
        if (href !== currentPath && !href.startsWith('#')) {
          isNavigatingRef.current = true;
          setLoading(true);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  // Hide loader when pathname or searchParams change (page loaded)
  useEffect(() => {
    if (isNavigatingRef.current) {
      currentPathnameRef.current = pathname;
      isNavigatingRef.current = false;
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      currentPathnameRef.current = pathname;
    }
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 animate-spin">
          <Image
            src="/snowflake.svg"
            alt="Loading"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-white text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

