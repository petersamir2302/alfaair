'use client';

import Link from 'next/link';
import { BlogPost, getAllBlogPosts } from '@/lib/blog';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

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
};

export function BlogPostDetail({ post }: { post: BlogPost }) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const isRTL = language === 'ar';

  const title = language === 'ar' ? post.title_ar : post.title_en;
  const content = language === 'ar' ? post.content_ar : post.content_en;
  const date = new Date(post.publishedAt).toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // Get related posts
  const relatedPosts = useMemo(() => {
    const allPosts = getAllBlogPosts();
    return allPosts
      .filter(p => p.slug !== post.slug && p.category === post.category)
      .slice(0, 3);
  }, [post.slug, post.category]);

  // Convert markdown-like content to HTML (simple version)
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let html = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith('# ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">${trimmed.substring(2)}</h1>`;
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">${trimmed.substring(3)}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h3 class="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">${trimmed.substring(4)}</h3>`;
      } else if (trimmed.startsWith('- ')) {
        // Lists
        if (!inList) {
          html += '<ul class="list-disc mb-4 space-y-2">';
          inList = true;
        }
        let listItem = trimmed.substring(2);
        // Format bold text in list items
        listItem = listItem.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<li class="ml-6 text-gray-700 dark:text-gray-300">${listItem}</li>`;
      } else if (trimmed === '') {
        // Empty lines
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += '<br />';
      } else {
        // Regular paragraphs
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        let formatted = trimmed;
        // Format bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
        html += `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${formatted}</p>`;
      }
    }

    if (inList) {
      html += '</ul>';
    }

    return html;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 group"
      >
        <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
        <span>{t('backToBlog')}</span>
      </Link>

      {/* Article */}
      <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header Image */}
        {post.image && (
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={post.image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {categoryLabels[language][post.category as keyof typeof categoryLabels[typeof language]]}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t('publishedOn')}: {date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{t('by')} {post.author}</span>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('relatedArticles')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => {
              const relatedTitle = language === 'ar' ? relatedPost.title_ar : relatedPost.title_en;
              const relatedExcerpt = language === 'ar' ? relatedPost.excerpt_ar : relatedPost.excerpt_en;

              return (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedPost.image && (
                    <div className="relative h-32 w-full">
                      <Image
                        src={relatedPost.image}
                        alt={relatedTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {relatedTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {relatedExcerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

