'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/supabase/types';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  canAddMore: () => boolean;
  maxItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = 'alfaair_compare_items';

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompareItems(parsed);
      } catch (error) {
        console.error('Error loading compare items:', error);
      }
    }
  }, []);

  // Save to localStorage whenever compareItems changes
  useEffect(() => {
    if (compareItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [compareItems]);

  const addToCompare = (product: Product) => {
    setCompareItems((prev) => {
      // Check if already in compare
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      // Check if max items reached
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const canAddMore = () => {
    return compareItems.length < MAX_COMPARE_ITEMS;
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((p) => p.id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        canAddMore,
        maxItems: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

