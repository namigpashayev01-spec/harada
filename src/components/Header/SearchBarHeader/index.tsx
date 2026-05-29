'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

interface AreaBounds {
  ne_lat: number;
  ne_lng: number;
  sw_lat: number;
  sw_lng: number;
}

// Minimum search radius (km). If Google's viewport is smaller than this,
// expand the bbox around its center so backend has a usable search area.
const MIN_BBOX_RADIUS_KM = 1.5;

function expandBboxIfTooSmall(b: AreaBounds): AreaBounds {
  const centerLat = (b.ne_lat + b.sw_lat) / 2;
  const centerLng = (b.ne_lng + b.sw_lng) / 2;
  // 1 degree of latitude ≈ 111 km; longitude depends on cos(lat).
  const latSpanKm = (b.ne_lat - b.sw_lat) * 111;
  const lngSpanKm = (b.ne_lng - b.sw_lng) * 111 * Math.cos((centerLat * Math.PI) / 180);
  const halfSpanKm = MIN_BBOX_RADIUS_KM;
  const needsExpand = latSpanKm < halfSpanKm * 2 || lngSpanKm < halfSpanKm * 2;
  if (!needsExpand) return b;
  const dLat = halfSpanKm / 111;
  const dLng = halfSpanKm / (111 * Math.cos((centerLat * Math.PI) / 180));
  const expanded: AreaBounds = {
    ne_lat: centerLat + dLat,
    ne_lng: centerLng + dLng,
    sw_lat: centerLat - dLat,
    sw_lng: centerLng - dLng,
  };
  console.log('[SearchArea] 🔁 Bbox too small, expanded:', {
    before: { latKm: latSpanKm.toFixed(2), lngKm: lngSpanKm.toFixed(2), bbox: b },
    after: { sideKm: (halfSpanKm * 2).toFixed(2), bbox: expanded },
  });
  return expanded;
}

const SearchBarHeader = () => {
  const [search, setSearch] = useState('');
  const [locationText, setLocationText] = useState('');
  const boundsRef = useRef<AreaBounds | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef('');
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';
  const langRef = useRef(lang);

  useEffect(() => { searchRef.current = search; }, [search]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  // Init Google Places Autocomplete on the location input
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    console.log('[SearchArea] 🚀 Mounted SearchBarHeader, starting Google Places init…');
    const init = () => {
      if (cancelled) return;
      attempts += 1;
      if (window.google?.maps?.places && locationInputRef.current) {
        // Guard against React StrictMode double-mount attaching two Autocompletes
        const inputEl = locationInputRef.current as HTMLInputElement & {
          __dinyAutocomplete?: unknown;
        };
        if (inputEl.__dinyAutocomplete) {
          console.log('[SearchArea] ⏭️ Autocomplete already attached on this input — skipping duplicate attach.');
          return;
        }
        console.log(`[SearchArea] ✅ Places library ready after ${attempts} attempts, attaching Autocomplete to input.`);
        const ac = new window.google.maps.places.Autocomplete(
          inputEl,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'az' },
            fields: ['geometry', 'formatted_address', 'name'],
          },
        );
        inputEl.__dinyAutocomplete = ac;
        console.log('[SearchArea] 🔧 Autocomplete options:', {
          types: ['geocode'],
          country: 'az',
          fields: ['geometry', 'formatted_address', 'name'],
        });
        ac.addListener('place_changed', () => {
          console.log('[SearchArea] 📍 place_changed event fired');
          const place = ac.getPlace();
          console.log('[SearchArea] 📦 Place object from Google:', {
            name: place.name,
            formatted_address: place.formatted_address,
            has_geometry: !!place.geometry,
            has_viewport: !!place.geometry?.viewport,
          });
          const viewport = place.geometry?.viewport;
          if (!viewport) {
            console.warn('[SearchArea] ⚠️ No viewport on selected place — cannot derive bbox. Clearing bounds.');
            boundsRef.current = null;
            return;
          }
          const ne = viewport.getNorthEast();
          const sw = viewport.getSouthWest();
          const rawBbox: AreaBounds = {
            ne_lat: ne.lat(),
            ne_lng: ne.lng(),
            sw_lat: sw.lat(),
            sw_lng: sw.lng(),
          };
          console.log('[SearchArea] 🗺️ Raw bbox from viewport:', rawBbox);
          const b = expandBboxIfTooSmall(rawBbox);
          boundsRef.current = b;
          const newLocationText = place.formatted_address || place.name || '';
          console.log('[SearchArea] 📝 Setting location text to:', newLocationText);
          setLocationText(newLocationText);

          const params = new URLSearchParams();
          const s = searchRef.current.trim();
          if (s) params.set('search', s);
          params.set('ne_lat', String(b.ne_lat));
          params.set('ne_lng', String(b.ne_lng));
          params.set('sw_lat', String(b.sw_lat));
          params.set('sw_lng', String(b.sw_lng));
          const url = `/${langRef.current}/places?${params.toString()}`;
          console.log('[SearchArea] 🚀 Navigating to:', url);
          router.push(url);
        });
        return;
      }
      // Diagnostic: after ~3s of polling, surface why it's not working.
      if (attempts === 180) {
        if (!window.google) {
          console.error('[SearchArea] ❌ Google Maps script has not loaded. Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and that the layout <Script> includes &libraries=places.');
        } else if (!window.google.maps) {
          console.error('[SearchArea] ❌ window.google exists but google.maps not yet ready.');
        } else if (!window.google.maps.places) {
          console.error('[SearchArea] ❌ Places library missing — script must be loaded with &libraries=places. Hard refresh the page (Ctrl+Shift+R) and ensure Places API is enabled in Google Cloud Console for this API key.');
        }
      }
      requestAnimationFrame(init);
    };
    init();
    return () => {
      console.log('[SearchArea] 🧹 Cleanup — cancelling Places init polling');
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    console.log('[SearchArea] 🔘 Submit button / Enter pressed');
    const params = new URLSearchParams();
    const s = search.trim();
    if (s) params.set('search', s);
    const b = boundsRef.current;
    if (b) {
      console.log('[SearchArea] 📤 Submitting WITH bbox:', b, '| search:', s || '(empty)');
      params.set('ne_lat', String(b.ne_lat));
      params.set('ne_lng', String(b.ne_lng));
      params.set('sw_lat', String(b.sw_lat));
      params.set('sw_lng', String(b.sw_lng));
    } else {
      console.log('[SearchArea] 📤 Submitting WITHOUT bbox (no area selected) | search:', s || '(empty)');
    }
    const url = `/${lang}/places?${params.toString()}`;
    console.log('[SearchArea] 🚀 Navigating to:', url);
    router.push(url);
  };

  return (
    <div className="bg-white rounded-[14px] px-3 sm:px-[22px] py-[10px]">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-[16px] w-full h-full">
        {/* Location input — 20% */}
        <div className="sm:w-[20%] relative min-w-0 flex-shrink-0">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            ref={locationInputRef}
            type="text"
            placeholder="Search area"
            value={locationText}
            onChange={(e) => {
              console.log('[SearchArea] ⌨️ Location input changed:', e.target.value);
              setLocationText(e.target.value);
              if (!e.target.value) {
                console.log('[SearchArea] 🧽 Input cleared — resetting bounds');
                boundsRef.current = null;
              }
            }}
            onFocus={() => console.log('[SearchArea] 🎯 Location input focused')}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            className="pl-10 pr-3 border border-[#ECECEC] placeholder:text-[#969696] outline-none h-12 rounded-[12px] w-full text-black bg-transparent"
          />
        </div>

        {/* Divider on desktop */}
        <div className="hidden sm:block h-8 w-px bg-gray-200 flex-shrink-0" />

        {/* Search input — 80% */}
        <div className="flex-1 relative min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
          </svg>
          <Input
            type="text"
            placeholder="Cuisine, restaurant & pub & cafe name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="pl-10 border border-[#ECECEC] placeholder:text-[#969696] shadow-none h-12 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[12px] w-full text-black"
          />
        </div>

        {/* Search button */}
        <div className="flex-shrink-0">
          <span
            onClick={() => submit()}
            className="h-[43px] cursor-pointer p-[14px] inline-flex items-center justify-center w-full sm:w-[43px] rounded-[14px] bg-[#2F4F4F] hover:bg-[#1e3535]">
            <Search className="h-[16px] w-[16px] text-white" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchBarHeader;
