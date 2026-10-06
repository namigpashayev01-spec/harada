'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Copy } from 'lucide-react';
import ownerService, { type WorkingHourRow } from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

const DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
] as const;

const DAY_LABELS: Record<string, Record<string, string>> = {
  az: {
    monday: 'Bazar ertəsi', tuesday: 'Çərşənbə axşamı', wednesday: 'Çərşənbə',
    thursday: 'Cümə axşamı', friday: 'Cümə', saturday: 'Şənbə', sunday: 'Bazar',
  },
  en: {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  },
  ru: {
    monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
    thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье',
  },
};

const MEAL_LABELS: Record<string, Record<string, string>> = {
  az: { breakfast: 'Səhər', lunch: 'Nahar', dinner: 'Şam', title: 'İş saatları',
        subtitle: 'Rezervasiya saatları buradan yaranır. Bağlı olan vaxt üçün rezervasiya təklif edilmir.',
        copy: 'Bazar ertəsinin saatlarını hamıya tətbiq et' },
  en: { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', title: 'Opening hours',
        subtitle: 'Booking slots are built from these hours. Closed periods are never offered.',
        copy: "Copy Monday's hours to every day" },
  ru: { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин', title: 'Часы работы',
        subtitle: 'Слоты для броней строятся из этих часов. Закрытое время не предлагается.',
        copy: 'Применить часы понедельника ко всем дням' },
};

const MEALS = ['breakfast', 'lunch', 'dinner'] as const;

function emptyRow(day: string): WorkingHourRow {
  return {
    day_of_week: day,
    breakfast_start: null, breakfast_end: null, breakfast_active: false,
    lunch_start: null, lunch_end: null, lunch_active: false,
    dinner_start: null, dinner_end: null, dinner_active: false,
  };
}

/** '07:00:00' → '07:00' (time input yalnız bu formanı qəbul edir) */
const hhmm = (v: string | null) => (v ? v.slice(0, 5) : '');

export default function ManagerHoursPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const dayL = DAY_LABELS[lang] ?? DAY_LABELS.az;
  const mealL = MEAL_LABELS[lang] ?? MEAL_LABELS.az;

  const [rows, setRows] = useState<WorkingHourRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'hours', restaurant.id],
    queryFn: () => ownerService.getHours(restaurant.id),
  });

  useEffect(() => {
    if (!data) return;
    setRows(
      DAYS.map(
        (d) => data.data.find((r) => r.day_of_week === d) ?? emptyRow(d),
      ),
    );
  }, [data]);

  const patch = (day: string, changes: Partial<WorkingHourRow>) =>
    setRows((prev) =>
      prev.map((r) => (r.day_of_week === day ? { ...r, ...changes } : r)),
    );

  const copyMonday = () => {
    const monday = rows.find((r) => r.day_of_week === 'monday');
    if (!monday) return;
    setRows((prev) =>
      prev.map((r) => ({ ...monday, day_of_week: r.day_of_week })),
    );
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await ownerService.updateHours(
        restaurant.id,
        rows.map((r) => ({
          ...r,
          breakfast_start: hhmm(r.breakfast_start) || null,
          breakfast_end: hhmm(r.breakfast_end) || null,
          lunch_start: hhmm(r.lunch_start) || null,
          lunch_end: hhmm(r.lunch_end) || null,
          dinner_start: hhmm(r.dinner_start) || null,
          dinner_end: hhmm(r.dinner_end) || null,
        })),
      );
      setSaved(true);
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{mealL.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{mealL.subtitle}</p>
      </div>

      <button
        onClick={copyMonday}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-gray-600 ring-1 ring-gray-200 hover:text-[#006653]">
        <Copy className="h-3.5 w-3.5" />
        {mealL.copy}
      </button>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.day_of_week}
            className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="mb-3 font-medium text-gray-900">
              {dayL[row.day_of_week]}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {MEALS.map((meal) => {
                const active = row[`${meal}_active`] as boolean;
                return (
                  <div
                    key={meal}
                    className={`rounded-lg border p-3 ${
                      active ? 'border-[#006653]/30 bg-[#eefae1]/40' : 'border-gray-200'
                    }`}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) =>
                          patch(row.day_of_week, {
                            [`${meal}_active`]: e.target.checked,
                          } as Partial<WorkingHourRow>)
                        }
                        className="h-4 w-4 accent-[#006653]"
                      />
                      {mealL[meal]}
                    </label>
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="time"
                        disabled={!active}
                        value={hhmm(row[`${meal}_start`] as string | null)}
                        onChange={(e) =>
                          patch(row.day_of_week, {
                            [`${meal}_start`]: e.target.value,
                          } as Partial<WorkingHourRow>)
                        }
                        className="w-full rounded border border-gray-200 px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="time"
                        disabled={!active}
                        value={hhmm(row[`${meal}_end`] as string | null)}
                        onChange={(e) =>
                          patch(row.day_of_week, {
                            [`${meal}_end`]: e.target.value,
                          } as Partial<WorkingHourRow>)
                        }
                        className="w-full rounded border border-gray-200 px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-[#006653] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00543f] disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? t.saving : t.save}
        </button>
        {saved && <span className="text-sm text-green-600">{t.saved}</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
