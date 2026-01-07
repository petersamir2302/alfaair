'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { BlogPost } from '@/lib/supabase/types';
import { Plus, Edit, Trash2, Calendar, User } from 'lucide-react';

interface AdminBlogClientProps {
  initialPosts: BlogPost[];
}

export function AdminBlogClient({ initialPosts }: AdminBlogClientProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const router = useRouter();
  const supabase = createClient();
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this post?')) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting post');
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      ar: {
        tips: 'نصائح',
        maintenance: 'صيانة',
        'buying-guide': 'دليل الشراء',
        'energy-saving': 'توفير الطاقة',
      },
      en: {
        tips: 'Tips',
        maintenance: 'Maintenance',
        'buying-guide': 'Buying Guide',
        'energy-saving': 'Energy Saving',
      },
    };
    return labels[language][category as keyof typeof labels[typeof language]] || category;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {language === 'ar' ? 'المدونة' : 'Blog'}
          </h1>
          <p className="text-secondary">
            {language === 'ar' ? 'إدارة مقالات المدونة' : 'Manage blog posts'}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'ar' ? 'مقال جديد' : 'New Post'}</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'العنوان' : 'Title'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'الفئة' : 'Category'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'المؤلف' : 'Author'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'تاريخ النشر' : 'Published'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {language === 'ar' ? 'لا توجد مقالات' : 'No posts found'}
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const title = language === 'ar' ? post.title_ar : post.title_en;
                  const date = new Date(post.published_at).toLocaleDateString(
                    language === 'ar' ? 'ar-EG' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' }
                  );

                  return (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {getCategoryLabel(post.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

