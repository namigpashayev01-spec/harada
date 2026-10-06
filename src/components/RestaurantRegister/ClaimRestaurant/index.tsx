'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Check, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ownerService, {
  type ClaimableRestaurant,
} from '@/services/owner.service';
import { useAuth } from '@/context/AuthContext';
import type { RestaurantRegisterDict } from '@/components/RestaurantRegister/translations';

const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';
const inputCls =
  'border-gray-200 focus-visible:border-[#006653] focus-visible:ring-[#006653]/20';

/**
 * Saytda ARTIQ olan restoranın sahibliyini tələb etmək. Yeni restoran
 * qeydiyyatından fərqlidir: burada restoran seçilir, məlumat yenidən
 * yazılmır.
 */
export default function ClaimRestaurant({
  t,
  lang,
}: {
  t: RestaurantRegisterDict;
  lang: string;
}) {
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ClaimableRestaurant[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<ClaimableRestaurant | null>(null);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setError(null);
    try {
      const res = await ownerService.searchClaimable(query.trim());
      setResults(res.data);
    } catch {
      setError(t.submitError);
    } finally {
      setSearching(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!isAuthenticated) {
      setError(t.loginRequired);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await ownerService.claim({
        restoran_id: selected.id,
        contact_name: contactName,
        contact_phone: contactPhone,
        position,
        message,
      });
      setDone(true);
    } catch (err: unknown) {
      const serverMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(serverMessage || t.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Card className="border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <CheckCircle2 className="h-12 w-12 text-[#006653]" />
          <p className="text-lg font-semibold text-gray-900">{t.successTitle}</p>
          <p className="text-sm text-gray-500">{selected?.title}</p>
          <Link
            href={`/${lang}/dashboard/restaurant`}
            className="mt-2 text-sm font-medium text-[#006653] underline underline-offset-2">
            {t.alreadyListedCta}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-lg font-semibold text-gray-900">
          {t.alreadyListedTitle}
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">{t.alreadyListedText}</p>

        <form onSubmit={search} className="mt-5 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.namePh}
            className={inputCls}
          />
          <Button
            type="submit"
            disabled={searching || query.trim().length < 2}
            className="bg-[#006653] hover:bg-[#00543f]">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {results && results.length === 0 && (
          <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            {t.alreadyListedText}
          </p>
        )}

        {results && results.length > 0 && (
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {results.map((r) => {
              const isSelected = selected?.id === r.id;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    disabled={r.claimed}
                    onClick={() => setSelected(r)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      r.claimed
                        ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                        : isSelected
                          ? 'border-[#006653] bg-[#006653]/5'
                          : 'border-gray-200 hover:border-[#006653]'
                    }`}>
                    <span className="mt-0.5">
                      {r.claimed ? (
                        <Lock className="h-4 w-4" />
                      ) : isSelected ? (
                        <Check className="h-4 w-4 text-[#006653]" />
                      ) : (
                        <span className="block h-4 w-4 rounded-full border border-gray-300" />
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{r.title}</span>
                      {r.address && (
                        <span className="block text-xs text-gray-500">
                          {r.address}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selected && !selected.claimed && (
          <form onSubmit={submit} className="mt-6 space-y-4 border-t border-gray-100 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>{t.ownerName} *</label>
                <Input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={t.ownerNamePh}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>{t.phone} *</label>
                <Input
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder={t.phonePh}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>{t.positionLabel}</label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{t.description}</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={inputCls}
              />
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {error}
                  {!isAuthenticated && (
                    <>
                      {' '}
                      <Link
                        href={`/${lang}/login`}
                        className="font-medium underline underline-offset-2">
                        {t.loginCta}
                      </Link>
                    </>
                  )}
                </span>
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#006653] hover:bg-[#00543f]">
              {submitting ? t.submitting : t.submit}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
