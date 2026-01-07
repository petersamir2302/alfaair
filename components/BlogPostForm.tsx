'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { marked } from 'marked';

interface BlogPostFormProps {
  post?: BlogPost;
}

// Helper function to detect if content is markdown or HTML
function isMarkdown(content: string): boolean {
  if (!content) return false;
  // Simple heuristic: if it contains markdown syntax, it's markdown
  const markdownPatterns = [
    /^#+\s/m,           // Headers
    /^\*\s/m,           // Bullet lists
    /^\d+\.\s/m,        // Numbered lists
    /\[.*\]\(.*\)/m,    // Links
    /!\[.*\]\(.*\)/m,   // Images
    /```/m,             // Code blocks
    /\*\*.*\*\*/m,      // Bold
    /\*.*\*/m,          // Italic
  ];
  return markdownPatterns.some(pattern => pattern.test(content));
}

// Convert markdown to HTML
function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  if (!isMarkdown(markdown)) return markdown; // Already HTML or empty
  return marked.parse(markdown) as string;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const supabase = createClient();

  // Convert markdown to HTML for initial content
  const initialContentAr = post?.content_ar ? markdownToHtml(post.content_ar) : '';
  const initialContentEn = post?.content_en ? markdownToHtml(post.content_en) : '';

  const [formData, setFormData] = useState({
    slug: post?.slug || '',
    title_ar: post?.title_ar || '',
    title_en: post?.title_en || '',
    excerpt_ar: post?.excerpt_ar || '',
    excerpt_en: post?.excerpt_en || '',
    content_ar: initialContentAr,
    content_en: initialContentEn,
    author: post?.author || 'AlfaAir Team',
    published_at: post?.published_at || new Date().toISOString().split('T')[0],
    image_url: post?.image_url || '',
    category: post?.category || 'tips' as 'tips' | 'maintenance' | 'buying-guide' | 'energy-saving',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(post?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Image upload handler for editor
  const handleImageUpload = async (file: File, editor: any) => {
    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
        setUploadingImage(false);
        return;
      }

      const { url } = await response.json();
      editor.chain().focus().setImage({ src: url }).run();
      setUploadingImage(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  // Handle blog image upload
  const handleBlogImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
        setUploadingImage(false);
        return;
      }

      const { url } = await response.json();
      setImagePreview(url);
      setFormData((prev) => ({ ...prev, image_url: url }));
      setUploadingImage(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  // Tiptap editor for Arabic content
  const editorAr = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: language === 'ar' ? 'ابدأ الكتابة...' : 'Start writing...',
      }),
    ],
    content: formData.content_ar,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content_ar: editor.getHTML() });
    },
  });

  // Tiptap editor for English content
  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: formData.content_en,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content_en: editor.getHTML() });
    },
  });

  // Update editors when formData changes externally
  useEffect(() => {
    if (editorAr && formData.content_ar !== editorAr.getHTML()) {
      editorAr.commands.setContent(formData.content_ar);
    }
  }, [formData.content_ar, editorAr]);

  useEffect(() => {
    if (editorEn && formData.content_en !== editorEn.getHTML()) {
      editorEn.commands.setContent(formData.content_en);
    }
  }, [formData.content_en, editorEn]);

  // Cleanup editors on unmount
  useEffect(() => {
    return () => {
      if (editorAr) {
        editorAr.destroy();
      }
      if (editorEn) {
        editorEn.destroy();
      }
    };
  }, [editorAr, editorEn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get latest HTML content from editors
      const contentAr = editorAr?.getHTML() || formData.content_ar;
      const contentEn = editorEn?.getHTML() || formData.content_en;

      const data = {
        ...formData,
        content_ar: contentAr,
        content_en: contentEn,
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
                {language === 'ar' ? 'صورة المدونة' : 'Blog Image'}
              </label>
              <div className="space-y-2">
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image_url: '' });
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                        handleBlogImageUpload(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                    </p>
                  )}
                </div>
              </div>
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'} *
              </label>
              {editorAr && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('bold') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleItalic().run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('italic') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleBulletList().run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('bulletList') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Bullet List"
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleOrderedList().run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('orderedList') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Numbered List"
                    >
                      1.
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().toggleBlockquote().run()}
                      className={`px-3 py-1 rounded ${editorAr.isActive('blockquote') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Quote"
                    >
                      "
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().setHorizontalRule().run()}
                      className="px-3 py-1 rounded bg-white hover:bg-gray-100"
                      title="Horizontal Rule"
                    >
                      ─
                    </button>
                    <label className="px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer" title="Insert Image">
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && editorAr) {
                            handleImageUpload(file, editorAr);
                          }
                        }}
                        disabled={uploadingImage}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().undo().run()}
                      className="px-3 py-1 rounded bg-white hover:bg-gray-100"
                      title="Undo"
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      onClick={() => editorAr.chain().focus().redo().run()}
                      className="px-3 py-1 rounded bg-white hover:bg-gray-100"
                      title="Redo"
                    >
                      ↷
                    </button>
                  </div>
                  {/* Editor */}
                  <div className="prose max-w-none p-4 min-h-[400px] bg-white">
                    <EditorContent editor={editorAr} />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المحتوى (إنجليزي)' : 'Content (English)'} *
              </label>
              {editorEn && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('bold') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleItalic().run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('italic') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleBulletList().run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('bulletList') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Bullet List"
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleOrderedList().run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('orderedList') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Numbered List"
                    >
                      1.
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().toggleBlockquote().run()}
                      className={`px-3 py-1 rounded ${editorEn.isActive('blockquote') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
                      title="Quote"
                    >
                      "
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().setHorizontalRule().run()}
                      className="px-3 py-1 rounded bg-white hover:bg-gray-100"
                      title="Horizontal Rule"
                    >
                      ─
                    </button>
                    <label className="px-3 py-1 rounded bg-white hover:bg-gray-100 cursor-pointer" title="Insert Image">
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && editorEn) {
                            handleImageUpload(file, editorEn);
                          }
                        }}
                        disabled={uploadingImage}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().undo().run()}
                      className="px-3 py-1 rounded bg-white hover:bg-gray-100"
                      title="Undo"
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      onClick={() => editorEn.chain().focus().redo().run()}
                      className="px-3 py-1 rounded bg-white hover:bg-gray-100"
                      title="Redo"
                    >
                      ↷
                    </button>
                  </div>
                  {/* Editor */}
                  <div className="prose max-w-none p-4 min-h-[400px] bg-white">
                    <EditorContent editor={editorEn} />
                  </div>
                </div>
              )}
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

