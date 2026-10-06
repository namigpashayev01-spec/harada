'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Loader2, Check, X, Phone, Users, Clock, CalendarDays, MessageSquare,
} from 'lucide-react';
import ownerService, { type ReservationFilter } from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

const L: Record<string, Record<string, string>> = {
  az: {
    title: 'Rezervasiyalar', subtitle: 'Gələn sorğuları təsdiqləyin və ya rədd edin.',
    pending: 'Gözləyən', confirmed: 'Təsdiqlənmiş', declined: 'Rədd edilmiş', all: 'Hamısı',
    empty: 'Bu bölmədə rezervasiya yoxdur.', confirm: 'Təsdiqlə', reject: 'Rədd et',
    reason: 'Səbəb (könüllü)', guests: 'qonaq',
  },
  en: {
    title: 'Reservations', subtitle: 'Confirm or decline incoming requests.',
    pending: 'Pending', confirmed: 'Confirmed', declined: 'Declined', all: 'All',
    empty: 'No reservations in this view.', confirm: 'Confirm', reject: 'Decline',
    reason: 'Reason (optional)', guests: 'guests',
  },
  ru: {
    title: 'Бронирования', subtitle: 'Подтверждайте или отклоняйте заявки.',
    pending: 'Ожидают', confirmed: 'Подтверждены', declined: 'Отклонены', all: 'Все',
    empty: 'В этом разделе броней нет.', confirm: 'Подтвердить', reject: 'Отклонить',
    reason: 'Причина (необязательно)', guests: 'гостей',
  },
};

const BADGE: Record<string, string> = {
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-green-50 text-green-700',
  danger: 'bg-red-50 text-red-700',
};

const FILTERS: ReservationFilter[] = ['pending', 'confirmed', 'declined', 'all'];

export default function ManagerReservationsPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const l = L[lang] ?? L.az;
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<ReservationFilter>('pending');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'reservations', restaurant.id, filter],
    queryFn: () => ownerService.getReservations(restaurant.id, filter),
  });

  const act = async (id: number, action: 'confirm' | 'reject') => {
    setBusyId(id);
    setError(null);
    try {
      if (action === 'confirm') {
        await ownerService.confirmReservation(restaurant.id, id);
      } else {
        await ownerService.rejectReservation(restaurant.id, id, reason || undefined);
      }
      setRejectingId(null);
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['owner', 'reservations'] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'summary'] });
    } catch {
      setError(t.failed);
    } finally {
      setBusyId(null);
    }
  };

  const rows = data?.data ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{l.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{l.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              filter === key
                ? 'bg-[#006653] text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:text-[#006653]'
            }`}>
            {l[key]}
            {key === 'pending' && (data?.counts.pending ?? 0) > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-400/90 px-1.5 text-[11px] text-white">
                {data!.counts.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          {l.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{r.guest_names}</p>
                  <p className="text-xs text-gray-500">#{r.booking_id ?? r.id}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    BADGE[r.status_color] ?? 'bg-gray-100 text-gray-600'
                  }`}>
                  {r.status_label}
                </span>
              </div>

              <dl className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />{r.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />{r.time ?? '—'}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  {r.guest_count} {l.guests}
                </div>
                <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-[#006653] hover:underline">
                  <Phone className="h-4 w-4" />{r.phone}
                </a>
                {r.special_request && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span>{r.special_request}</span>
                  </div>
                )}
              </dl>

              {(r.status === 1 || r.status === 3) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.status === 1 && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => act(r.id, 'confirm')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#006653] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#00543f] disabled:opacity-60">
                      {busyId === r.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {l.confirm}
                    </button>
                  )}
                  <button
                    disabled={busyId === r.id}
                    onClick={() => setRejectingId(rejectingId === r.id ? null : r.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60">
                    <X className="h-3.5 w-3.5" />{l.reject}
                  </button>
                </div>
              )}

              {rejectingId === r.id && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={l.reason}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                  />
                  <button
                    disabled={busyId === r.id}
                    onClick={() => act(r.id, 'reject')}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
                    {l.reject}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
