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

const SearchBarHeader = ({ compact = false }: { compact?: boolean }) => {
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

  const fieldH = compact ? 'h-10' : 'h-14';

  return (
    <div
      className={
        compact
          ? 'bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm'
          : 'bg-white rounded-2xl p-2 sm:p-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]'
      }>
      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-1 w-full">
        {/* Location input */}
        <div className="sm:w-[34%] relative min-w-0 flex-shrink-0">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-ink z-10" />
          <input
            ref={locationInputRef}
            type="text"
            placeholder="Rayon / Metro"
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
            className={`pl-11 pr-3 placeholder:text-[#969696] outline-none ${fieldH} rounded-xl w-full text-black bg-gray-50 sm:bg-transparent focus:bg-gray-50 transition-colors`}
          />
        </div>

        {/* Divider on desktop */}
        <div className="hidden sm:block self-center h-8 w-px bg-gray-200 flex-shrink-0" />

        {/* Search input */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Input
            type="text"
            placeholder="Mətbəx, restoran adı..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className={`pl-11 border-0 bg-gray-50 sm:bg-transparent focus:bg-gray-50 placeholder:text-[#969696] shadow-none ${fieldH} focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl w-full text-black`}
          />
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() => submit()}
          className={`flex-shrink-0 cursor-pointer inline-flex items-center justify-center gap-2 ${fieldH} px-6 rounded-xl bg-brand hover:bg-brand-hover text-brand-ink font-semibold transition-colors`}>
          <Search className="h-5 w-5" />
          AXTAR
        </button>
      </div>
    </div>
  );
};

export default SearchBarHeader;
