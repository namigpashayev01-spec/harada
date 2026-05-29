'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import propertyService from '@/services/property.service';
import { Property } from '@/types/restaurant';

interface FilterSelection {
  properties: number[];
  subproperties: number[];
  is_special_offer: boolean;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterSelection) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
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

  const emitChange = (
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

  const handleSubpropertyChange = (propertyId: number, subId: string) => {
    const updated = { ...selectedSubproperties, [propertyId]: Number(subId) };
    setSelectedSubproperties(updated);
    emitChange(updated, activeToggles, specialOffer);
  };

  const handleToggle = (propertyId: number) => {
    const updated = new Set(activeToggles);
    if (updated.has(propertyId)) {
      updated.delete(propertyId);
    } else {
      updated.add(propertyId);
    }
    setActiveToggles(updated);
    emitChange(selectedSubproperties, updated, specialOffer);
  };

  const handleSpecialOfferToggle = () => {
    const next = !specialOffer;
    setSpecialOffer(next);
    emitChange(selectedSubproperties, activeToggles, next);
  };

  if (!properties.length) return null;

  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-center gap-3 min-w-max px-4 sm:px-0">
        {properties.map((property) =>
          property.sub_properties.length > 0 ? (
            <Select
              key={property.id}
              value={selectedSubproperties[property.id]?.toString() ?? ''}
              onValueChange={(val) =>
                handleSubpropertyChange(property.id, val)
              }>
              <SelectTrigger className="rounded-full border border-[#E5E5E5] text-sm text-gray-700 hover:bg-gray-50 h-auto py-2 px-4 gap-2 w-auto bg-white focus:ring-0">
                {property.icon && !property.icon.endsWith('/storage') && (
                  <Image
                    src={property.icon}
                    alt={property.title || 'Property'}
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span>{property.title}</span>
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
            <Button
              key={property.id}
              variant="outline"
              onClick={() => handleToggle(property.id)}
              className={`rounded-full border text-sm h-auto py-2 px-4 gap-2 transition-colors ${
                activeToggles.has(property.id)
                  ? 'bg-[#2F4F4F] text-white border-[#2F4F4F] hover:bg-[#1e3535] hover:text-white'
                  : 'border-[#E5E5E5] text-gray-700 hover:bg-gray-50 bg-transparent'
              }`}>
              {property.icon && !property.icon.endsWith('/storage') && (
                <Image
                  src={property.icon}
                  alt={property.title || 'Property'}
                  width={16}
                  height={16}
                  className={`w-4 h-4 object-contain ${activeToggles.has(property.id) ? 'brightness-0 invert' : ''}`}
                />
              )}
              {property.title}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          onClick={handleSpecialOfferToggle}
          className={`rounded-full border text-sm h-auto py-2 px-4 gap-2 transition-colors ${
            specialOffer
              ? 'bg-[#2F4F4F] text-white border-[#2F4F4F] hover:bg-[#1e3535] hover:text-white'
              : 'border-[#E5E5E5] text-gray-700 hover:bg-gray-50 bg-transparent'
          }`}>
          <Tag className="w-4 h-4" />
          Special Offer
        </Button>
      </div>
    </div>
  );
}
