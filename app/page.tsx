import { createClient } from '@/lib/supabase-server';
import Nav from '@/components/Nav';
import DownloadButton from '@/components/DownloadButton';
import PremiumButton from '@/components/PremiumButton';
import { PAYMENTS_ENABLED } from '@/lib/payments';

const FILE_TYPE_LABEL: Record<string, string> = {
  pdf: 'PDF',
  word: 'Word',
  image: 'Image',
};

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, is_admin, is_premium')
    .eq('id', user!.id)
    .single();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const { data: materials } = await supabase
    .from('materials')
    .select('id, title, file_type, file_path, category_id, is_premium, created_at')
    .order('created_at', { ascending: false });

  const byCategory = new Map<string, typeof materials>();
  (materials ?? []).forEach((m) => {
    const list = byCategory.get(m.category_id) ?? [];
    list.push(m);
    byCategory.set(m.category_id, list as any);
  });

  const userCanAccessPremium = !!profile?.is_admin || !!profile?.is_premium;

  return (
    <>
      <Nav username={profile?.username ?? 'user'} isAdmin={!!profile?.is_admin} />
      <main className="max-w-4xl mx-auto px-5 py-8">
        {PAYMENTS_ENABLED && !userCanAccessPremium && (
          <div className="card p-4 mb-8 flex items-center justify-between gap-4">
            <p className="text-sm text-ink/70">
              Premium materials access panna, upgrade pannunga.
            </p>
            <PremiumButton />
          </div>
        )}

        {(categories ?? []).map((cat) => {
          const items = byCategory.get(cat.id) ?? [];
          return (
            <section key={cat.id} className="mb-8">
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="font-display text-lg text-navy">{cat.name}</h2>
                <span className="text-xs text-ink/40">{items.length} files</span>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-ink/40 italic">
                  Innum files upload aagala.
                </p>
              ) : (
                <ul className="card divide-y divide-line">
                  {items.map((m: any) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-ink">
                          {m.title}
                          {PAYMENTS_ENABLED && m.is_premium && (
                            <span className="ml-2 text-xs text-gold">★</span>
                          )}
                        </p>
                        <p className="text-xs text-ink/40 uppercase tracking-wide">
                          {FILE_TYPE_LABEL[m.file_type] ?? m.file_type}
                        </p>
                      </div>
                      <DownloadButton
                        filePath={m.file_path}
                        isPremium={m.is_premium}
                        userCanAccess={userCanAccessPremium}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </main>
    </>
  );
}
