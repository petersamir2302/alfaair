'use client';

import { useState, useEffect } from 'react';
import { Product, Category, Brand } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function ProductSearchWizard() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedHorsePower, setSelectedHorsePower] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableHorsePowers, setAvailableHorsePowers] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, brandsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name_ar'),
        supabase.from('brands').select('*').order('name_ar'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedBrand) {
      const fetchHorsePowers = async () => {
        const { data } = await supabase
          .from('products')
          .select('power_hp')
          .eq('category_id', selectedCategory)
          .eq('brand_id', selectedBrand)
          .not('power_hp', 'is', null);

        if (data) {
          const uniqueHorsePowers = Array.from(
            new Set(data.map((p) => p.power_hp).filter((hp): hp is number => hp !== null))
          ).sort((a, b) => a - b);
          setAvailableHorsePowers(uniqueHorsePowers);
        }
      };

      fetchHorsePowers();
    }
  }, [selectedCategory, selectedBrand]);

  useEffect(() => {
    if (selectedCategory && selectedBrand && selectedHorsePower) {
      const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', selectedCategory)
          .eq('brand_id', selectedBrand)
          .eq('power_hp', parseFloat(selectedHorsePower));

        if (data) {
          setFilteredProducts(data);
        }
        setLoading(false);
      };

      fetchProducts();
    }
  }, [selectedCategory, selectedBrand, selectedHorsePower]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedBrand('');
    setSelectedHorsePower('');
    setStep(2);
  };

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedHorsePower('');
    setStep(3);
  };

  const handleHorsePowerSelect = (hp: string) => {
    setSelectedHorsePower(hp);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedHorsePower('');
    setFilteredProducts([]);
  };

  return (
    <section id="search" className="mb-8 md:mb-16 py-6 md:py-12">
      <div className="text-center mb-6 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          {language === 'ar' ? 'أخبرنا ماذا تريد' : 'Tell Us What You Want'}
        </h2>
        <p className="text-gray-300 text-sm md:text-base">
          {language === 'ar' 
            ? 'اختر الفئة والعلامة التجارية والقدرة لنجد لك المنتج المناسب'
            : 'Select category, brand, and horsepower to find the perfect product'}
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 md:p-8">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {language === 'ar' ? 'الخطوة 1: اختر الفئة' : 'Step 1: Choose Category'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="bg-slate-700 hover:bg-primary p-4 rounded-lg transition-all text-white text-sm md:text-base"
                >
                  {language === 'ar' ? category.name_ar : category.name_en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Brand Selection */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedBrand('');
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-lighter"
              >
                <ChevronLeft className="w-5 h-5" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <h3 className="text-xl font-bold text-white text-center flex-1">
                {language === 'ar' ? 'الخطوة 2: اختر العلامة التجارية' : 'Step 2: Choose Brand'}
              </h3>
              <div className="w-20"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.id)}
                  className="bg-slate-700 hover:bg-primary p-4 rounded-lg transition-all text-white text-sm md:text-base flex flex-col items-center gap-2"
                >
                  {brand.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logo_url}
                      alt={brand.name_en}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <span>{language === 'ar' ? brand.name_ar : brand.name_en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Horse Power Selection */}
        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setStep(2);
                  setSelectedHorsePower('');
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-lighter"
              >
                <ChevronLeft className="w-5 h-5" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <h3 className="text-xl font-bold text-white text-center flex-1">
                {language === 'ar' ? 'الخطوة 3: اختر القدرة (حصان)' : 'Step 3: Choose Horsepower'}
              </h3>
              <div className="w-20"></div>
            </div>
            {availableHorsePowers.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                {language === 'ar' 
                  ? 'لا توجد قدرات متاحة لهذه الفئة والعلامة التجارية'
                  : 'No horsepower options available for this category and brand'}
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {availableHorsePowers.map((hp) => (
                  <button
                    key={hp}
                    onClick={() => handleHorsePowerSelect(hp.toString())}
                    className="bg-slate-700 hover:bg-primary p-4 rounded-lg transition-all text-white text-lg font-bold"
                  >
                    {hp} {language === 'ar' ? 'حصان' : 'HP'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setStep(3);
                  setSelectedHorsePower('');
                  setFilteredProducts([]);
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-lighter"
              >
                <ChevronLeft className="w-5 h-5" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <h3 className="text-xl font-bold text-white text-center flex-1">
                {language === 'ar' ? 'النتائج' : 'Results'}
              </h3>
              <button
                onClick={reset}
                className="text-primary hover:text-primary-lighter text-sm"
              >
                {language === 'ar' ? 'إعادة' : 'Reset'}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-300">
                {t('loading')}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-300">
                {language === 'ar' 
                  ? 'لا توجد منتجات تطابق اختيارك'
                  : 'No products match your selection'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Steps - Bottom */}
        <div className="flex items-center justify-center mt-8 gap-2 md:gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all ${
                  step >= s
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600 mx-1 md:mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


