import { AdminPageHeader } from '@/components/AdminPageHeader';
import { BlogPostForm } from '@/components/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader titleKey="addBlogPost" />
      <BlogPostForm />
    </div>
  );
}

