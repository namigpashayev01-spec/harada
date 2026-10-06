'use client';

import { useState } from 'react';
import { Store, PlusCircle } from 'lucide-react';
import RestaurantRegisterForm from '@/components/RestaurantRegister/RestaurantRegisterForm';
import ClaimRestaurant from '@/components/RestaurantRegister/ClaimRestaurant';
import type { RestaurantRegisterDict } from '@/components/RestaurantRegister/translations';

/**
 * İki yol: restoran saytda varsa sahibliyi tələb edilir, yoxdursa yeni
 * qeydiyyat forması doldurulur. Sahiblik yolu öndədir, çünki saytda onsuz da
 * 1700-dən çox restoran var — əksər müraciətlər elə mövcud restorandır.
 */
export default function RegisterPaths({
  t,
  lang,
}: {
  t: RestaurantRegisterDict;
  lang: string;
}) {
  const [path, setPath] = useState<'claim' | 'new'>('claim');

  const tabCls = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
      active
        ? 'border-[#006653] bg-[#006653] text-white'
        : 'border-gray-200 bg-white text-gray-600 hover:border-[#006653] hover:text-[#006653]'
    }`;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => setPath('claim')}
          className={tabCls(path === 'claim')}>
          <Store className="h-4 w-4" />
          {t.alreadyListedTitle}
        </button>
        <button
          type="button"
          onClick={() => setPath('new')}
          className={tabCls(path === 'new')}>
          <PlusCircle className="h-4 w-4" />
          {t.heading}
        </button>
      </div>

      {path === 'claim' ? (
        <ClaimRestaurant t={t} lang={lang} />
      ) : (
        <RestaurantRegisterForm t={t} />
      )}
    </div>
  );
}
