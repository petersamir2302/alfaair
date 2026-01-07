import { AdminBlogClient } from '@/components/AdminBlogClient';
import { createClient } from '@/lib/supabase/server';

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  return <AdminBlogClient initialPosts={posts || []} />;
}

