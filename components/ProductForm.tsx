'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Brand, Category } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Upload, X, Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name_ar: product?.name_ar || '',
    name_en: product?.name_en || '',
    description_ar: product?.description_ar || '',
    description_en: product?.description_en || '',
    cold: product?.cold ?? (product ? false : true),
    hot: product?.hot || false,
    inverter: product?.inverter || false,
    power_hp: product?.power_hp?.toString() || '',
    color: product?.color || 'white',
    smart: product?.smart || false,
    digital_screen: product?.digital_screen ?? (product ? false : true),
    plasma: product?.plasma || false,
    ai: product?.ai || false,
    warranty_years: product?.warranty_years?.toString() || '5',
    price: product?.price?.toString() || '',
    inventory: product?.inventory?.toString() || '',
    coverage_area_sqm: product?.coverage_area_sqm?.toString() || '',
    brand_id: product?.brand_id || '',
    category_id: product?.category_id || '',
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.image_url) {
      return [product.image_url];
    }
    return [];
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      const [brandsRes, categoriesRes] = await Promise.all([
        supabase.from('brands').select('*').order('name_ar'),
        supabase.from('categories').select('*').order('name_ar'),
      ]);
      
      if (brandsRes.data) setBrands(brandsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    };
    
    fetchBrandsAndCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);
      
      // Create previews for new files
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    // Get existing images from previews (these are the ones that weren't removed)
    const existingImageUrls = imagePreviews.filter((preview) => 
      preview.startsWith('http') || preview.startsWith('https')
    );
    
    if (imageFiles.length === 0) {
      // Return existing images if no new files
      return existingImageUrls.length > 0 
        ? existingImageUrls 
        : (product?.images && product.images.length > 0 
          ? product.images 
          : (product?.image_url ? [product.image_url] : []));
    }

    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      // Upload all new files
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          alert(error.error || 'Failed to upload image');
          setUploading(false);
          return [];
        }

        const { url } = await response.json();
        uploadedUrls.push(url);
      }

      // Combine existing images (from previews) with new uploaded ones
      const allImages = [...existingImageUrls, ...uploadedUrls];
      setUploading(false);
      return allImages;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
      setUploading(false);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmittingRef.current || saving || uploading) {
      return;
    }
    
    isSubmittingRef.current = true;
    setSaving(true);

    const images = await uploadImages();
    if (imageFiles.length > 0 && images.length === 0) {
      setSaving(false);
      isSubmittingRef.current = false;
      return;
    }

    // Use first image as image_url for backward compatibility
    const imageUrl = images.length > 0 ? images[0] : (product?.image_url || null);

    const productData = {
      ...formData,
      power_hp: formData.power_hp ? parseFloat(formData.power_hp) : null,
      warranty_years: formData.warranty_years ? parseFloat(formData.warranty_years) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      inventory: formData.inventory ? parseInt(formData.inventory) : null,
      coverage_area_sqm: formData.coverage_area_sqm ? parseFloat(formData.coverage_area_sqm) : null,
      image_url: imageUrl,
      images: images.length > 0 ? images : null,
      brand_id: formData.brand_id || null,
      category_id: formData.category_id || null,
    };

    if (product) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id);
      
      if (error) {
        alert(error.message);
        setSaving(false);
        isSubmittingRef.current = false;
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    } else {
      // Get max order value to set new product at the end
      const { data: maxOrderData } = await supabase
        .from('products')
        .select('order')
        .order('order', { ascending: false, nullsFirst: false })
        .limit(1);
      
      const maxOrder = maxOrderData && maxOrderData.length > 0 ? (maxOrderData[0]?.order ?? 0) : 0;
      const newProductData = {
        ...productData,
        order: maxOrder + 1,
      };

      const { error } = await supabase
        .from('products')
        .insert([newProductData]);
      
      if (error) {
        alert(error.message);
        setSaving(false);
        isSubmittingRef.current = false;
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
        <h2 className="text-xl font-bold text-primary mb-4">
          {t('basicInfo')}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('name')} (AR)
            </label>
            <input
              type="text"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('name')} (EN)
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('brand')}
            </label>
            <select
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('selectBrand')}</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {language === 'ar' ? brand.name_ar : brand.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('category')}
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === 'ar' ? category.name_ar : category.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('description')} (AR)
            </label>
            <textarea
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('description')} (EN)
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
        <h2 className="text-xl font-bold text-primary mb-4">
          {t('specifications')}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('power')}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.power_hp}
              onChange={(e) => setFormData({ ...formData, power_hp: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('color')}
            </label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="white">{language === 'ar' ? 'أبيض' : 'White'}</option>
              <option value="black">{language === 'ar' ? 'أسود' : 'Black'}</option>
              <option value="silver">{language === 'ar' ? 'فضي' : 'Silver'}</option>
              <option value="red">{language === 'ar' ? 'أحمر' : 'Red'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('warranty')}
            </label>
            <input
              type="number"
              value={formData.warranty_years}
              onChange={(e) => setFormData({ ...formData, warranty_years: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('price')} (EGP)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('inventory')}
            </label>
            <input
              type="number"
              min="0"
              value={formData.inventory}
              onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('coverageArea')}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.coverage_area_sqm}
              onChange={(e) => setFormData({ ...formData, coverage_area_sqm: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder={language === 'ar' ? 'متر مربع' : 'Square meters'}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {[
            { key: 'cold', label: t('cold') },
            { key: 'hot', label: t('hot') },
            { key: 'inverter', label: t('inverter') },
            { key: 'smart', label: t('smart') },
            { key: 'digital_screen', label: t('digitalScreen') },
            { key: 'plasma', label: t('plasma') },
            { key: 'ai', label: t('ai') },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
        <h2 className="text-xl font-bold text-primary mb-4">{t('image')}</h2>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-full h-48 rounded-lg overflow-hidden border border-primary/10">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary/20 rounded-lg cursor-pointer hover:bg-accent-light transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-secondary" />
            <p className="text-sm text-secondary">
              {imagePreviews.length > 0 ? t('changeImage') : t('selectImage')} ({language === 'ar' ? 'يمكن إضافة عدة صور' : 'Multiple images allowed'})
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving || uploading ? t('saving') : t('save')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-primary/10 rounded-lg hover:bg-accent-light transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

