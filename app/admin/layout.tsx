import { createClient } from '@/lib/supabase/server';
import { AdminHeader } from '@/components/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles authentication check and redirects
  // We just need to verify user exists for TypeScript/component purposes
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8 pt-24">{children}</div>
    </div>
  );
}

