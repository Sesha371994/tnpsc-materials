import { createClient } from '@/lib/supabase-server';
import Nav from '@/components/Nav';
import UploadForm from '@/components/UploadForm';

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, is_admin')
    .eq('id', user!.id)
    .single();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  // Middleware already blocks non-admins, this is a second guard.
  if (!profile?.is_admin) {
    return (
      <>
        <Nav username={profile?.username ?? 'user'} isAdmin={false} />
        <main className="max-w-4xl mx-auto px-5 py-8">
          <p className="text-err">Admin access mattum. Ungalukku access illa.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav username={profile.username} isAdmin={true} />
      <main className="max-w-lg mx-auto px-5 py-8">
        <h2 className="font-display text-xl text-navy mb-5">Upload material</h2>
        <UploadForm categories={categories ?? []} />
      </main>
    </>
  );
}
