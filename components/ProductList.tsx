'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/supabase/types';
import { ProductCard } from './ProductCard';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Search, Filter } from 'lucide-react';

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    cold: false,
    hot: false,
    inverter: false,
    smart: false,
    digitalScreen: false,
    plasma: false,
    ai: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const name = language === 'ar' ? product.name_ar : product.name_en;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (product.description_en?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesFilters = 
        (!filters.cold || product.cold) &&
        (!filters.hot || product.hot) &&
        (!filters.inverter || product.inverter) &&
        (!filters.smart || product.smart) &&
        (!filters.digitalScreen || product.digital_screen) &&
        (!filters.plasma || product.plasma) &&
        (!filters.ai || product.ai);

      return matchesSearch && matchesFilters;
    });
  }, [initialProducts, searchQuery, filters, language]);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/40 placeholder:text-secondary shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 rounded-lg hover:bg-accent-light hover:border-primary/40 transition-colors text-secondary hover:text-primary shadow-sm"
        >
          <Filter className="w-5 h-5" />
          <span>{t('filter')}</span>
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-primary/10 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'cold', label: t('cold') },
              { key: 'hot', label: t('hot') },
              { key: 'inverter', label: t('inverter') },
              { key: 'smart', label: t('smart') },
              { key: 'digitalScreen', label: t('digitalScreen') },
              { key: 'plasma', label: t('plasma') },
              { key: 'ai', label: t('ai') },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={filters[key as keyof typeof filters]}
                  onChange={(e) =>
                    setFilters({ ...filters, [key]: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-secondary">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary text-lg">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

