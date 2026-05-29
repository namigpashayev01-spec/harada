'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { SlidersHorizontal, Tag, X, Check } from 'lucide-react';
import propertyService from '@/services/property.service';
import { Property } from '@/types/restaurant';

interface FilterSelection {
  properties: number[];
  subproperties: number[];
  is_special_offer: boolean;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterSelection) => void;
  /** Currently selected category (shown as a removable pill in the summary). */
  activeCategoryLabel?: string | null;
  onClearCategory?: () => void;
}

export default function FilterBar({
  onFilterChange,
  activeCategoryLabel,
  onClearCategory,
}: FilterBarProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedSubproperties, setSelectedSubproperties] = useState<
    Record<number, number>
  >({});
  const [activeToggles, setActiveToggles] = useState<Set<number>>(new Set());
  const [specialOffer, setSpecialOffer] = useState(false);

  useEffect(() => {
    propertyService
      .getProperties()
      .then((res) => setProperties(res.data))
      .catch(console.error);
  }, []);

  const emit = (
    subprops: Record<number, number>,
    toggles: Set<number>,
    isSpecialOffer: boolean,
  ) => {
    onFilterChange({
      subproperties: Object.values(subprops).filter(Boolean),
      properties: Array.from(toggles),
      is_special_offer: isSpecialOffer,
    });
  };

  const setSubproperty = (propertyId: number, subId: number | null) => {
    const updated = { ...selectedSubproperties };
    if (subId == null) delete updated[propertyId];
    else updated[propertyId] = subId;
    setSelectedSubproperties(updated);
    emit(updated, activeToggles, specialOffer);
  };

  const toggleProperty = (propertyId: number) => {
    const updated = new Set(activeToggles);
    if (updated.has(propertyId)) updated.delete(propertyId);
    else updated.add(propertyId);
    setActiveToggles(updated);
    emit(selectedSubproperties, updated, specialOffer);
  };

  const toggleSpecialOffer = () => {
    const next = !specialOffer;
    setSpecialOffer(next);
    emit(selectedSubproperties, activeToggles, next);
  };

  const clearAll = () => {
    setSelectedSubproperties({});
    setActiveToggles(new Set());
    setSpecialOffer(false);
    emit({}, new Set(), false);
    onClearCategory?.();
  };

  const activeCount =
    Object.values(selectedSubproperties).filter(Boolean).length +
    activeToggles.size +
    (specialOffer ? 1 : 0);

  /* Human-readable list of currently applied filters, each removable. */
  type ActivePill = { key: string; label: string; remove: () => void };
  const activePills: ActivePill[] = [];
  if (activeCategoryLabel && onClearCategory)
    activePills.push({
      key: 'category',
      label: activeCategoryLabel,
      remove: onClearCategory,
    });
  if (specialOffer)
    activePills.push({
      key: 'offer',
      label: 'Endirimli',
      remove: toggleSpecialOffer,
    });
  properties.forEach((property) => {
    const subId = selectedSubproperties[property.id];
    if (subId) {
      const sub = property.sub_properties.find((s) => s.id === subId);
      if (sub)
        activePills.push({
          key: `sub-${sub.id}`,
          label: sub.title,
          remove: () => setSubproperty(property.id, null),
        });
    }
    if (activeToggles.has(property.id))
      activePills.push({
        key: `prop-${property.id}`,
        label: property.title,
        remove: () => toggleProperty(property.id),
      });
  });

  if (!properties.length) return null;

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-[#006653] text-white border-[#006653]'
        : 'border-gray-200 bg-white text-gray-700 hover:border-[#006653]/40'
    }`;

  /* Shared filter controls used inside the mobile drawer (chip-based). */
  const DrawerControls = (
    <div className="space-y-6">
      {/* Special offer */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Təkliflər
        </p>
        <button onClick={toggleSpecialOffer} className={chip(specialOffer)}>
          <Tag className="h-4 w-4" />
          Endirimli
          {specialOffer && <Check className="h-4 w-4" />}
        </button>
      </div>

      {properties.map((property) => (
        <div key={property.id}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {property.title}
          </p>
          {property.sub_properties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {property.sub_properties.map((sub) => {
                const active = selectedSubproperties[property.id] === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() =>
                      setSubproperty(property.id, active ? null : sub.id)
                    }
                    className={chip(active)}>
                    {sub.title}
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              onClick={() => toggleProperty(property.id)}
              className={chip(activeToggles.has(property.id))}>
              {property.title}
              {activeToggles.has(property.id) && <Check className="h-4 w-4" />}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full py-4">
      {/* ---- Mobile: single Filters button → drawer ---- */}
      <div className="px-4 md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrlər
              {activeCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#006653] px-1.5 text-xs font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="flex flex-row items-center justify-between">
              <DrawerTitle className="text-lg">Filtrlər</DrawerTitle>
              <DrawerClose asChild>
                <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>
            </DrawerHeader>

            <div className="overflow-y-auto px-4 pb-2">{DrawerControls}</div>

            <DrawerFooter className="flex-row gap-3 border-t border-gray-100">
              <button
                onClick={clearAll}
                disabled={activeCount === 0}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 disabled:opacity-40">
                Təmizlə
              </button>
              <DrawerClose asChild>
                <button className="flex-1 rounded-xl bg-[#9fe870] py-3 text-sm font-semibold text-[#14532d] hover:bg-[#8fdc5c]">
                  Nəticələri göstər
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ---- Desktop: inline filter row ---- */}
      <div className="hidden items-center gap-3 overflow-x-auto md:flex">
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gray-700">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrlər:
        </span>

        <button onClick={toggleSpecialOffer} className={chip(specialOffer)}>
          <Tag className="h-4 w-4" />
          Endirimli
        </button>

        {properties.map((property) =>
          property.sub_properties.length > 0 ? (
            <Select
              key={property.id}
              value={selectedSubproperties[property.id]?.toString() ?? ''}
              onValueChange={(val) => setSubproperty(property.id, Number(val))}>
              <SelectTrigger
                className={`h-auto w-auto gap-2 rounded-full border px-4 py-2 text-sm focus:ring-0 ${
                  selectedSubproperties[property.id]
                    ? 'border-[#006653] bg-[#006653] text-white [&_svg]:text-white'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}>
                {property.icon && !property.icon.endsWith('/storage') && (
                  <Image
                    src={property.icon}
                    alt={property.title || 'Property'}
                    width={16}
                    height={16}
                    className={`h-4 w-4 object-contain ${selectedSubproperties[property.id] ? 'brightness-0 invert' : ''}`}
                  />
                )}
                <SelectValue placeholder={property.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {property.sub_properties.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <button
              key={property.id}
              onClick={() => toggleProperty(property.id)}
              className={chip(activeToggles.has(property.id))}>
              {property.icon && !property.icon.endsWith('/storage') && (
                <Image
                  src={property.icon}
                  alt={property.title || 'Property'}
                  width={16}
                  height={16}
                  className={`h-4 w-4 object-contain ${activeToggles.has(property.id) ? 'brightness-0 invert' : ''}`}
                />
              )}
              {property.title}
            </button>
          ),
        )}

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="ml-1 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-[#006653] hover:bg-[#006653]/10">
            <X className="h-4 w-4" />
            Təmizlə ({activeCount})
          </button>
        )}
      </div>

      {/* ---- Active filter summary (both mobile & desktop) ---- */}
      {activePills.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 px-4 md:px-0">
          <span className="text-xs font-medium text-gray-500">
            Seçilmiş filtrlər:
          </span>
          {activePills.map((pill) => (
            <button
              key={pill.key}
              onClick={pill.remove}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#eefae1] px-3 py-1 text-sm font-medium text-[#14532d] transition-colors hover:bg-[#dff3c9]">
              {pill.label}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-[#006653] underline-offset-2 hover:underline">
            Hamısını sil
          </button>
        </div>
      )}
    </div>
  );
}
