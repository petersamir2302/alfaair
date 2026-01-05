'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brand } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface BrandFormProps {
  brand?: Brand;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name_ar: brand?.name_ar || '',
    name_en: brand?.name_en || '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return brand?.logo_url || null;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', logoFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to upload logo');
        setUploading(false);
        return null;
      }

      const { url } = await response.json();
      setUploading(false);
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logo. Please try again.');
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const logoUrl = await uploadLogo();
    if (logoFile && !logoUrl) {
      setSaving(false);
      return;
    }

    const brandData = {
      ...formData,
      logo_url: logoUrl || brand?.logo_url || null,
    };

    if (brand) {
      const { error } = await supabase
        .from('brands')
        .update(brandData)
        .eq('id', brand.id);
      
      if (error) {
        alert(error.message);
      } else {
        router.push('/admin/brands');
        router.refresh();
      }
    } else {
      const { error } = await supabase
        .from('brands')
        .insert([brandData]);
      
      if (error) {
        alert(error.message);
      } else {
        router.push('/admin/brands');
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
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
        <h2 className="text-xl font-bold text-primary mb-4">{t('logo')}</h2>

        {logoPreview && (
          <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border border-primary/10">
            <Image
              src={logoPreview}
              alt="Logo Preview"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setLogoPreview(null);
                setLogoFile(null);
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
              {logoPreview ? t('changeImage') : t('selectImage')}
            </p>
          </div>
          <input
            type="file"
            accept="image/*,.svg"
            onChange={handleLogoChange}
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

