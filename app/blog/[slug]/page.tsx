import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { BlogPostDetail } from '@/components/BlogPostDetail';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title_en} | AlfaAir Blog`,
    description: post.excerpt_en,
    keywords: [
      "air conditioning",
      "AC",
      "Egypt",
      post.category,
      "tips",
      "maintenance",
    ],
    openGraph: {
      title: `${post.title_en} | AlfaAir Blog`,
      description: post.excerpt_en,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      siteName: "AlfaAir",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title_en,
      description: post.excerpt_en,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <BlogPostDetail post={post} />
      </div>
    </main>
  );
}

