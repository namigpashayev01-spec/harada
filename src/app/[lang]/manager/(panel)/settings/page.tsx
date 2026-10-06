'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, ShieldCheck, Hourglass, MapPin } from 'lucide-react';
import ownerService from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

const L: Record<string, Record<string, string>> = {
  az: {
    title: 'Restoran məlumatları',
    instant: 'Dərhal canlı olur',
    instantHint: 'Bu sahələri dəyişdirən kimi saytda görünür.',
    moderated: 'Admin təsdiqi tələb edir',
    moderatedHint:
      'Ad, ünvan və xəritə nöqtəsi SEO-ya təsir etdiyi üçün yoxlanışdan sonra dəyişir.',
    capacity: 'Bir saatda maksimum qonaq sayı',
    capacityHint: 'Boş buraxsanız limit tətbiq olunmur.',
    bookings: 'Onlayn rezervasiya qəbul edirəm',
    phone: 'Telefon',
    whatsapp: 'WhatsApp nömrəsi',
    website: 'Sayt',
    avgPrice: 'Orta hesab (AZN)',
    description: 'Restoran haqqında',
    name: 'Restoranın adı',
    address: 'Ünvan',
    lat: 'Enlik (latitude)',
    lng: 'Uzunluq (longitude)',
    send: 'Təsdiqə göndər',
    sent: 'Təsdiqə göndərildi',
    pending: 'Baxılır',
    mapHint:
      'Koordinatı Google Maps-də məkanınıza sağ klik edib rəqəmləri kopyalayaraq tapa bilərsiniz.',
  },
  en: {
    title: 'Restaurant details',
    instant: 'Goes live immediately',
    instantHint: 'These fields appear on the site as soon as you save.',
    moderated: 'Needs admin approval',
    moderatedHint:
      'Name, address and map point affect search results, so they change after review.',
    capacity: 'Maximum guests per hour',
    capacityHint: 'Leave empty for no limit.',
    bookings: 'I accept online bookings',
    phone: 'Phone',
    whatsapp: 'WhatsApp number',
    website: 'Website',
    avgPrice: 'Average bill (AZN)',
    description: 'About the restaurant',
    name: 'Restaurant name',
    address: 'Address',
    lat: 'Latitude',
    lng: 'Longitude',
    send: 'Send for approval',
    sent: 'Sent for approval',
    pending: 'Under review',
    mapHint:
      'Right-click your location in Google Maps and copy the numbers to get the coordinates.',
  },
  ru: {
    title: 'Данные ресторана',
    instant: 'Публикуется сразу',
    instantHint: 'Эти поля появляются на сайте сразу после сохранения.',
    moderated: 'Требует одобрения',
    moderatedHint:
      'Название, адрес и точка на карте влияют на поиск, поэтому меняются после проверки.',
    capacity: 'Максимум гостей в час',
    capacityHint: 'Пустое поле — без лимита.',
    bookings: 'Принимаю онлайн-брони',
    phone: 'Телефон',
    whatsapp: 'Номер WhatsApp',
    website: 'Сайт',
    avgPrice: 'Средний чек (AZN)',
    description: 'О ресторане',
    name: 'Название ресторана',
    address: 'Адрес',
    lat: 'Широта',
    lng: 'Долгота',
    send: 'Отправить на проверку',
    sent: 'Отправлено на проверку',
    pending: 'На рассмотрении',
    mapHint:
      'Кликните правой кнопкой на месте в Google Maps и скопируйте числа.',
  },
};

const input =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#006653]';
const label = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function ManagerSettingsPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const l = L[lang] ?? L.az;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'settings', restaurant.id],
    queryFn: () => ownerService.getSettings(restaurant.id),
  });

  const [form, setForm] = useState({
    reservation_enabled: true,
    reservation_capacity: '',
    phone: '',
    whatsapp: '',
    website: '',
    average_price: '',
    description: '',
  });
  const [moderated, setModerated] = useState({ title: '', address: '', latitude: '', longitude: '' });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sentField, setSentField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const tr = data.translations[lang] ?? data.translations.az;
    setForm({
      reservation_enabled: data.reservation_enabled,
      reservation_capacity: data.reservation_capacity?.toString() ?? '',
      phone: data.phone ?? '',
      whatsapp: data.whatsapp ?? '',
      website: data.website ?? '',
      average_price: data.average_price ?? '',
      description: tr?.description ?? '',
    });
    setModerated({
      title: tr?.title ?? '',
      address: tr?.address ?? '',
      latitude: data.latitude ?? '',
      longitude: data.longitude ?? '',
    });
  }, [data, lang]);

  const saveInstant = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await ownerService.updateSettings(restaurant.id, {
        reservation_enabled: form.reservation_enabled,
        reservation_capacity: form.reservation_capacity || null,
        phone: form.phone,
        whatsapp: form.whatsapp,
        website: form.website || null,
        average_price: form.average_price || null,
        description: { [lang]: form.description },
      });
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['owner', 'settings'] });
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  };

  const sendChange = async (field: keyof typeof moderated) => {
    setBusy(true);
    setError(null);
    try {
      await ownerService.requestChange(
        restaurant.id,
        field,
        moderated[field],
        field === 'latitude' || field === 'longitude' ? undefined : lang,
      );
      setSentField(field);
      queryClient.invalidateQueries({ queryKey: ['owner', 'settings'] });
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const pendingFor = (field: string) =>
    data?.pending_changes.find((c) => c.field === field);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">{l.title}</h1>

      {/* Dərhal canlı olan sahələr */}
      <section className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#006653]" />
          <h2 className="font-semibold text-gray-900">{l.instant}</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">{l.instantHint}</p>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.reservation_enabled}
              onChange={(e) =>
                setForm((f) => ({ ...f, reservation_enabled: e.target.checked }))
              }
              className="h-4 w-4 accent-[#006653]"
            />
            {l.bookings}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>{l.capacity}</label>
              <input
                type="number"
                min={1}
                value={form.reservation_capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reservation_capacity: e.target.value }))
                }
                className={input}
              />
              <p className="mt-1 text-xs text-gray-400">{l.capacityHint}</p>
            </div>
            <div>
              <label className={label}>{l.avgPrice}</label>
              <input
                value={form.average_price}
                onChange={(e) => setForm((f) => ({ ...f, average_price: e.target.value }))}
                className={input}
              />
            </div>
            <div>
              <label className={label}>{l.phone}</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={input}
              />
            </div>
            <div>
              <label className={label}>{l.whatsapp}</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>{l.website}</label>
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://"
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>
                {l.description} ({lang.toUpperCase()})
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={input}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveInstant}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-[#006653] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00543f] disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? t.saving : t.save}
            </button>
            {saved && <span className="text-sm text-green-600">{t.saved}</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      </section>

      {/* Moderasiyadan keçən sahələr */}
      <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-5">
        <div className="mb-1 flex items-center gap-2">
          <Hourglass className="h-4 w-4 text-amber-600" />
          <h2 className="font-semibold text-gray-900">{l.moderated}</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">{l.moderatedHint}</p>

        <div className="space-y-4">
          {(
            [
              ['title', l.name],
              ['address', l.address],
              ['latitude', l.lat],
              ['longitude', l.lng],
            ] as const
          ).map(([field, fieldLabel]) => {
            const pending = pendingFor(field);
            return (
              <div key={field}>
                <label className={label}>{fieldLabel}</label>
                <div className="flex flex-wrap gap-2">
                  <input
                    value={moderated[field]}
                    onChange={(e) =>
                      setModerated((m) => ({ ...m, [field]: e.target.value }))
                    }
                    className={`${input} min-w-0 flex-1`}
                  />
                  <button
                    onClick={() => sendChange(field)}
                    disabled={busy}
                    className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-300 hover:bg-amber-50 disabled:opacity-60">
                    {sentField === field ? l.sent : l.send}
                  </button>
                </div>
                {pending && (
                  <p className="mt-1 text-xs text-amber-700">
                    {l.pending}: {pending.new_value}
                  </p>
                )}
              </div>
            );
          })}
          <p className="flex items-start gap-1.5 text-xs text-gray-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {l.mapHint}
          </p>
        </div>
      </section>
    </div>
  );
}
