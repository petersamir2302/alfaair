import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { BlogPostForm } from '@/components/BlogPostForm';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader titleKey="editBlogPost" />
      <BlogPostForm post={post} />
    </div>
  );
}

