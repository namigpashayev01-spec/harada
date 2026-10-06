'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import ownerService, { type MenuDishRow } from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

const L: Record<string, Record<string, string>> = {
  az: {
    title: 'Menyu və qiymətlər',
    subtitle: 'Dəyişikliklər dərhal saytda görünür.',
    newCategory: 'Yeni kateqoriya adı',
    newDish: 'Yemək adı',
    price: 'Qiymət',
    empty: 'Menyu boşdur. Birinci kateqoriyanı əlavə edin.',
    noDishes: 'Bu kateqoriyada yemək yoxdur.',
    lang: 'Dil',
  },
  en: {
    title: 'Menu & prices',
    subtitle: 'Changes appear on the site immediately.',
    newCategory: 'New category name',
    newDish: 'Dish name',
    price: 'Price',
    empty: 'The menu is empty. Add your first category.',
    noDishes: 'No dishes in this category.',
    lang: 'Language',
  },
  ru: {
    title: 'Меню и цены',
    subtitle: 'Изменения сразу видны на сайте.',
    newCategory: 'Название новой категории',
    newDish: 'Название блюда',
    price: 'Цена',
    empty: 'Меню пустое. Добавьте первую категорию.',
    noDishes: 'В этой категории нет блюд.',
    lang: 'Язык',
  },
};

const LOCALES = ['az', 'en', 'ru'] as const;

export default function ManagerMenuPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const l = L[lang] ?? L.az;
  const queryClient = useQueryClient();

  // Menyu üç dildədir — hansı dili redaktə etdiyini istifadəçi özü seçir
  const [locale, setLocale] = useState<string>('az');
  const [newCategory, setNewCategory] = useState('');
  const [dishDrafts, setDishDrafts] = useState<Record<number, { name: string; price: string }>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; price: string }>({ name: '', price: '' });
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'menu', restaurant.id, locale],
    queryFn: () => ownerService.getMenu(restaurant.id, locale),
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ['owner', 'menu', restaurant.id] });

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setBusy(true);
    try {
      await ownerService.addCategory(restaurant.id, { [locale]: newCategory.trim(), az: newCategory.trim() });
      setNewCategory('');
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const addDish = async (categoryId: number) => {
    const draft = dishDrafts[categoryId];
    if (!draft?.name.trim()) return;
    setBusy(true);
    try {
      await ownerService.addDish(restaurant.id, categoryId, {
        name: { [locale]: draft.name.trim(), az: draft.name.trim() },
        price: draft.price || undefined,
      });
      setDishDrafts((p) => ({ ...p, [categoryId]: { name: '', price: '' } }));
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const saveDish = async (dish: MenuDishRow) => {
    setBusy(true);
    try {
      await ownerService.updateDish(restaurant.id, dish.id, {
        name: { [locale]: editDraft.name },
        price: editDraft.price,
      });
      setEditing(null);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const removeDish = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    await ownerService.deleteDish(restaurant.id, id);
    refresh();
  };

  const removeCategory = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    await ownerService.deleteCategory(restaurant.id, id);
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{l.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{l.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{l.lang}:</span>
          {LOCALES.map((lc) => (
            <button
              key={lc}
              onClick={() => setLocale(lc)}
              className={`rounded-lg px-2.5 py-1 text-sm font-medium uppercase ${
                locale === lc
                  ? 'bg-[#006653] text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200'
              }`}>
              {lc}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder={l.newCategory}
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          onClick={addCategory}
          disabled={busy || !newCategory.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#006653] px-4 py-2 text-sm font-medium text-white hover:bg-[#00543f] disabled:opacity-50">
          <Plus className="h-4 w-4" />
          {t.add}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (data?.data.length ?? 0) === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          {l.empty}
        </p>
      ) : (
        <div className="space-y-4">
          {data!.data.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <h2 className="font-semibold text-gray-900">
                  {cat.name ?? `#${cat.id}`}
                </h2>
                <span className="text-xs text-gray-400">
                  {cat.dishes.length}
                </span>
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="ml-auto text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <ul className="divide-y divide-gray-50">
                {cat.dishes.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-400">{l.noDishes}</li>
                )}
                {cat.dishes.map((dish) => (
                  <li key={dish.id} className="flex items-center gap-3 px-4 py-2.5">
                    {editing === dish.id ? (
                      <>
                        <input
                          value={editDraft.name}
                          onChange={(e) =>
                            setEditDraft((p) => ({ ...p, name: e.target.value }))
                          }
                          className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-sm"
                        />
                        <input
                          value={editDraft.price}
                          onChange={(e) =>
                            setEditDraft((p) => ({ ...p, price: e.target.value }))
                          }
                          className="w-24 rounded border border-gray-200 px-2 py-1 text-sm"
                          placeholder={l.price}
                        />
                        <button
                          onClick={() => saveDish(dish)}
                          disabled={busy}
                          className="text-green-600">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditing(null)} className="text-gray-400">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                          {dish.name ?? `#${dish.id}`}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {dish.price ? `${dish.price} ₼` : '—'}
                        </span>
                        <button
                          onClick={() => {
                            setEditing(dish.id);
                            setEditDraft({
                              name: dish.name ?? '',
                              price: dish.price ?? '',
                            });
                          }}
                          className="text-gray-400 hover:text-[#006653]">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeDish(dish.id)}
                          className="text-gray-400 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 border-t border-gray-100 p-3">
                <input
                  value={dishDrafts[cat.id]?.name ?? ''}
                  onChange={(e) =>
                    setDishDrafts((p) => ({
                      ...p,
                      [cat.id]: { name: e.target.value, price: p[cat.id]?.price ?? '' },
                    }))
                  }
                  placeholder={l.newDish}
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                />
                <input
                  value={dishDrafts[cat.id]?.price ?? ''}
                  onChange={(e) =>
                    setDishDrafts((p) => ({
                      ...p,
                      [cat.id]: { name: p[cat.id]?.name ?? '', price: e.target.value },
                    }))
                  }
                  placeholder={l.price}
                  className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => addDish(cat.id)}
                  disabled={busy}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
