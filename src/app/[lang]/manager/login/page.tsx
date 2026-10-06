'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { managerDict } from '@/components/Manager/dict';

export default function ManagerLoginPage() {
  const params = useParams();
  const lang = (params?.lang as string) ?? 'az';
  const t = managerDict(lang);
  const router = useRouter();
  const { login, isAuthenticated, isInitializing } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Artıq girişlidirsə panelə keçirik
  useEffect(() => {
    if (!isInitializing && isAuthenticated) router.replace(`/${lang}`);
  }, [isInitializing, isAuthenticated, lang, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login({ email, password });
      router.replace(`/${lang}`);
    } catch {
      setError(t.loginFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#eefae1]">
            <Store className="h-6 w-6 text-[#006653]" />
          </span>
          <h1 className="mt-4 text-lg font-semibold text-gray-900">
            {t.loginTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#006653]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#006653]"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#006653] py-2.5 text-sm font-semibold text-white hover:bg-[#00543f] disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? t.signingIn : t.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
