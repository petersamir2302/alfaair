'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';

interface BlogPostFormProps {
  post?: BlogPost;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    slug: post?.slug || '',
    title_ar: post?.title_ar || '',
    title_en: post?.title_en || '',
    excerpt_ar: post?.excerpt_ar || '',
    excerpt_en: post?.excerpt_en || '',
    content_ar: post?.content_ar || '',
    content_en: post?.content_en || '',
    author: post?.author || 'AlfaAir Team',
    published_at: post?.published_at || new Date().toISOString().split('T')[0],
    image_url: post?.image_url || '',
    category: post?.category || 'tips' as 'tips' | 'maintenance' | 'buying-guide' | 'energy-saving',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        published_at: formData.published_at,
      };

      if (post) {
        const { error } = await supabase
          .from('blog_posts')
          .update(data)
          .eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([data]);
        if (error) throw error;
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-primary/10 p-6">
      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">{t('basicInfo')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="best-ac-units-egypt-2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الفئة' : 'Category'} *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="tips">{language === 'ar' ? 'نصائح' : 'Tips'}</option>
                <option value="maintenance">{language === 'ar' ? 'صيانة' : 'Maintenance'}</option>
                <option value="buying-guide">{language === 'ar' ? 'دليل الشراء' : 'Buying Guide'}</option>
                <option value="energy-saving">{language === 'ar' ? 'توفير الطاقة' : 'Energy Saving'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *
              </label>
              <input
                type="text"
                required
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
              </label>
              <input
                type="text"
                required
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'المؤلف' : 'Author'} *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'تاريخ النشر' : 'Published Date'} *
              </label>
              <input
                type="date"
                required
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            {language === 'ar' ? 'الملخص' : 'Excerpt'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الملخص (عربي)' : 'Excerpt (Arabic)'} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt_ar}
                onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الملخص (إنجليزي)' : 'Excerpt (English)'} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt_en}
                onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            {language === 'ar' ? 'المحتوى' : 'Content'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'} *
              </label>
              <textarea
                required
                rows={15}
                value={formData.content_ar}
                onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'المحتوى (إنجليزي)' : 'Content (English)'} *
              </label>
              <textarea
                required
                rows={15}
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? t('saving') : t('save')}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </form>
  );
}

