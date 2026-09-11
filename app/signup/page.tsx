'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

const EMAIL_DOMAIN = '@tnpsc-materials.local';
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!USERNAME_RE.test(username)) {
      setError('Username: letters, numbers, underscore mattum (3-20 characters).');
      return;
    }
    if (password.length < 6) {
      setError('Password kuraintha 6 characters irukanum.');
      return;
    }
    if (password !== confirm) {
      setError('Password rendum match aagala.');
      return;
    }

    setLoading(true);
    const cleanUsername = username.trim().toLowerCase();
    const email = cleanUsername + EMAIL_DOMAIN;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: cleanUsername } },
    });

    if (signUpError) {
      setLoading(false);
      if (signUpError.message.toLowerCase().includes('already')) {
        setError('Indha username already edukapattu irukku. Vera onnu try pannunga.');
      } else {
        setError(signUpError.message);
      }
      return;
    }

    if (data.user) {
      // Create the profile row. Requires "Confirm email" to be OFF in Supabase
      // auth settings so the session is active immediately after signUp.
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: cleanUsername,
        is_admin: false,
      });
    }

    setLoading(false);
    router.push('/');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-navy">Create account</h1>
          <p className="text-sm text-ink/60 mt-1">TET &amp; TNPSC Materials</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              type="password"
              className="input-field"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-err text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-5">
          Already account irukka?{' '}
          <Link href="/login" className="text-navy underline">
            Login pannunga
          </Link>
        </p>
      </div>
    </main>
  );
}
