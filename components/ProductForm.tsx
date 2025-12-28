'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Upload, X } from 'lucide-react';
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
    cold: product?.cold || false,
    hot: product?.hot || false,
    inverter: product?.inverter || false,
    power_hp: product?.power_hp?.toString() || '',
    color: product?.color || '',
    smart: product?.smart || false,
    digital_screen: product?.digital_screen || false,
    plasma: product?.plasma || false,
    ai: product?.ai || false,
    warranty_years: product?.warranty_years?.toString() || '',
    price: product?.price?.toString() || '',
    additional_specs_ar: product?.additional_specs_ar || '',
    additional_specs_en: product?.additional_specs_en || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return product?.image_url || null;

    setUploading(true);
    
    try {
      // Use the API route which handles authentication properly
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
        setUploading(false);
        return null;
      }

      const { url } = await response.json();
      setUploading(false);
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const imageUrl = await uploadImage();
    if (imageFile && !imageUrl) {
      setSaving(false);
      return;
    }

    const productData = {
      ...formData,
      power_hp: formData.power_hp ? parseFloat(formData.power_hp) : null,
      warranty_years: formData.warranty_years ? parseFloat(formData.warranty_years) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      image_url: imageUrl || product?.image_url || null,
    };

    if (product) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id);
      
      if (error) {
        alert(error.message);
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      
      if (error) {
        alert(error.message);
      } else {
        router.push('/admin/products');
        router.refresh();
      }
    }
    setSaving(false);
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
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('color')}
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('warranty')}
            </label>
            <input
              type="number"
              value={formData.warranty_years}
              onChange={(e) => setFormData({ ...formData, warranty_years: e.target.value })}
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
        <h2 className="text-xl font-bold text-primary mb-4">
          {t('additionalSpecs')}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('additionalSpecs')} (AR)
            </label>
            <textarea
              value={formData.additional_specs_ar}
              onChange={(e) => setFormData({ ...formData, additional_specs_ar: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              {t('additionalSpecs')} (EN)
            </label>
            <textarea
              value={formData.additional_specs_en}
              onChange={(e) => setFormData({ ...formData, additional_specs_en: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
        <h2 className="text-xl font-bold text-primary mb-4">{t('image')}</h2>

        {imagePreview && (
          <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border border-primary/10">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary/20 rounded-lg cursor-pointer hover:bg-accent-light transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-secondary" />
            <p className="text-sm text-secondary">
              {imagePreview ? t('changeImage') : t('selectImage')}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
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

