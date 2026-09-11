'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function Nav({
  username,
  isAdmin,
}: {
  username: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-navy text-paper">
      <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl tracking-wide">
            TET &amp; TNPSC Study Hall
          </h1>
          <p className="text-xs text-paper/60 tracking-widest uppercase mt-0.5">
            Notes · Papers · Materials
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-paper/80">
            {username}
            {isAdmin && (
              <span className="ml-2 text-gold border border-gold/50 rounded-sm px-1.5 py-0.5 text-xs">
                ADMIN
              </span>
            )}
          </span>
          {isAdmin && (
            <a href="/admin" className="underline decoration-gold/50 hover:decoration-gold">
              Upload panel
            </a>
          )}
          <button onClick={signOut} className="text-paper/70 hover:text-paper">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
