'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2, Ban } from 'lucide-react';
import ownerService from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

const L: Record<string, Record<string, string>> = {
  az: {
    title: 'Dolu saatlar',
    subtitle:
      'Burada bağladığınız saatlar saytda "Dolu" görünür və rezervasiya qəbul etmir. Tutum dolduqda saat onsuz da özü bağlanır — bura yalnız qapalı tədbir, təmir və bayram kimi hallar üçündür.',
    date: 'Tarix',
    hours: 'Saatlar',
    wholeDay: 'Bütün gün bağlıdır',
    reason: 'Səbəb (könüllü)',
    reasonPh: 'Qapalı tədbir, təmir…',
    empty: 'Bağlanmış saat yoxdur.',
    allDayBadge: 'Bütün gün',
    hint: 'Bir neçə saat seçə bilərsiniz.',
  },
  en: {
    title: 'Fully booked hours',
    subtitle:
      'Hours you close here show as "Full" on the site and stop taking bookings. When your capacity fills up the hour closes by itself — this is for private events, repairs and holidays.',
    date: 'Date',
    hours: 'Hours',
    wholeDay: 'Closed all day',
    reason: 'Reason (optional)',
    reasonPh: 'Private event, repairs…',
    empty: 'No closed hours.',
    allDayBadge: 'All day',
    hint: 'You can pick several hours.',
  },
  ru: {
    title: 'Занятые часы',
    subtitle:
      'Закрытые здесь часы показываются как «Занято» и не принимают брони. При заполнении вместимости час закрывается сам — это для частных мероприятий и ремонта.',
    date: 'Дата',
    hours: 'Часы',
    wholeDay: 'Закрыто весь день',
    reason: 'Причина (необязательно)',
    reasonPh: 'Частное мероприятие, ремонт…',
    empty: 'Закрытых часов нет.',
    allDayBadge: 'Весь день',
    hint: 'Можно выбрать несколько часов.',
  },
};

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export default function ManagerBlocksPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const l = L[lang] ?? L.az;
  const queryClient = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [times, setTimes] = useState<string[]>([]);
  const [wholeDay, setWholeDay] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'blocks', restaurant.id],
    queryFn: () => ownerService.getBlocks(restaurant.id),
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ['owner', 'blocks', restaurant.id] });

  const toggleHour = (h: string) =>
    setTimes((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wholeDay && times.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      await ownerService.addBlock(restaurant.id, {
        date,
        whole_day: wholeDay || undefined,
        times: wholeDay ? undefined : times,
        reason: reason || undefined,
      });
      setTimes([]);
      setWholeDay(false);
      setReason('');
      refresh();
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    await ownerService.removeBlock(restaurant.id, id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{l.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{l.subtitle}</p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {l.date}
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {l.reason}
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={l.reasonPh}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={wholeDay}
            onChange={(e) => setWholeDay(e.target.checked)}
            className="h-4 w-4 accent-[#006653]"
          />
          {l.wholeDay}
        </label>

        {!wholeDay && (
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              {l.hours}{' '}
              <span className="font-normal text-gray-400">· {l.hint}</span>
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => toggleHour(h)}
                  className={`rounded-lg border py-1.5 text-sm transition-colors ${
                    times.includes(h)
                      ? 'border-red-500 bg-red-50 font-medium text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy || (!wholeDay && times.length === 0)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
          {busy ? t.saving : l.title}
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : (data?.data.length ?? 0) === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
          {l.empty}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white">
          {data!.data.map((b) => (
            <li key={b.id} className="flex items-center gap-3 p-4">
              <span className="text-sm font-medium text-gray-900">{b.date}</span>
              {b.whole_day ? (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                  {l.allDayBadge}
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {b.time}
                </span>
              )}
              {b.reason && (
                <span className="truncate text-sm text-gray-500">{b.reason}</span>
              )}
              <button
                onClick={() => remove(b.id)}
                className="ml-auto text-gray-400 hover:text-red-600"
                aria-label={t.delete}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
