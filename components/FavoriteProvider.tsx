'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/supabase/types';

interface FavoriteContextType {
  favoriteItems: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isInFavorites: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

const STORAGE_KEY = 'alfaair_favorite_items';

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavoriteItems(parsed);
      } catch (error) {
        console.error('Error loading favorite items:', error);
      }
    }
  }, []);

  // Save to localStorage whenever favoriteItems changes
  useEffect(() => {
    if (favoriteItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteItems));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [favoriteItems]);

  const addToFavorites = (product: Product) => {
    setFavoriteItems((prev) => {
      // Check if already in favorites
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavoriteItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInFavorites = (productId: string) => {
    return favoriteItems.some((p) => p.id === productId);
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteItems,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}

