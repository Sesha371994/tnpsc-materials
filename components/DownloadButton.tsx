'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { PAYMENTS_ENABLED } from '@/lib/payments';

export default function DownloadButton({
  filePath,
  isPremium = false,
  userCanAccess = true,
}: {
  filePath: string;
  isPremium?: boolean;
  userCanAccess?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const locked = PAYMENTS_ENABLED && isPremium && !userCanAccess;

  async function handleDownload() {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('materials')
      .createSignedUrl(filePath, 60);

    setLoading(false);

    if (error || !data) {
      alert('Download link create panna mudiyala. Konjam neram kalichu try pannunga.');
      return;
    }
    window.open(data.signedUrl, '_blank');
  }

  if (locked) {
    return (
      <span className="text-xs text-gold border border-gold/40 rounded-sm px-3 py-1.5">
        🔒 Premium
      </span>
    );
  }

  return (
    <button onClick={handleDownload} disabled={loading} className="btn-gold text-sm">
      {loading ? 'Preparing…' : 'Download'}
    </button>
  );
}
