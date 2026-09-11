'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { PAYMENTS_ENABLED } from '@/lib/payments';

type Category = { id: string; name: string; slug: string };

function detectFileType(fileName: string): 'pdf' | 'word' | 'image' | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'doc' || ext === 'docx') return 'word';
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext ?? '')) return 'image';
  return null;
}

export default function UploadForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!file) {
      setError('File select pannunga.');
      return;
    }
    const fileType = detectFileType(file.name);
    if (!fileType) {
      setError('PDF, Word (.doc/.docx) illa image (.png/.jpg/.webp) mattum allow.');
      return;
    }

    setLoading(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${categoryId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setLoading(false);
      setError('Upload fail aachu: ' + uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from('materials').insert({
      title: title.trim() || file.name,
      category_id: categoryId,
      file_type: fileType,
      file_path: path,
      is_premium: PAYMENTS_ENABLED ? isPremium : false,
    });

    setLoading(false);

    if (insertError) {
      setError('File poyiduchu aana record save aagala: ' + insertError.message);
      return;
    }

    setStatus('Upload success!');
    setTitle('');
    setFile(null);
    (document.getElementById('file-input') as HTMLInputElement).value = '';
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. TNPSC Group 4 - General Studies Unit 3 Notes"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          className="input-field"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">File (PDF / Word / Image)</label>
        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      {PAYMENTS_ENABLED && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          Premium file (paid users mattum download panna mudiyum)
        </label>
      )}

      {error && <p className="text-err text-sm">{error}</p>}
      {status && <p className="text-ok text-sm">{status}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  );
}
