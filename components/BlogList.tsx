'use client';

import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const categoryLabels = {
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
} as const;

export function BlogList() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const posts = getAllBlogPosts();
  const isRTL = language === 'ar';

  const getCategoryLabel = (category: string) => {
    return categoryLabels[language][category as keyof typeof categoryLabels[typeof language]] || category;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('blog')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {language === 'ar' 
            ? 'نصائح وإرشادات خبراء حول التكييف في مصر'
            : 'Expert tips and guides about air conditioning in Egypt'
          }
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const title = language === 'ar' ? post.title_ar : post.title_en;
          const excerpt = language === 'ar' ? post.excerpt_ar : post.excerpt_en;
          const date = new Date(post.publishedAt).toLocaleDateString(
            language === 'ar' ? 'ar-EG' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' }
          );

          return (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              {post.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Category */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {getCategoryLabel(post.category)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                  {excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Read More */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium group"
                >
                  <span>{t('readMore')}</span>
                  <ArrowRight 
                    className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} 
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

