'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBarHeader from '@/components/Header/SearchBarHeader';
import FilterBar from '@/components/Places/FilterBar';
import RestaurantCard from '@/components/Places/RestaurantCard';
import GoogleMap, { MapLocation } from '@/components/Places/GoogleMap';
import PlaceBanner from '@/assets/images/places-banner.jpg';
import placeService from '@/services/place.service';
import categoriesService from '@/services/categories.service';
import { NearbyRestaurant } from '@/types/restaurant';
import { useParams } from 'next/navigation';
import { Category } from '@/types/category';

function PlacesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const search = searchParams.get('search') ?? '';
  const categoryIdParam = searchParams.get('category_id');
  const neLatParam = searchParams.get('ne_lat');
  const neLngParam = searchParams.get('ne_lng');
  const swLatParam = searchParams.get('sw_lat');
  const swLngParam = searchParams.get('sw_lng');
  const bbox =
    neLatParam && neLngParam && swLatParam && swLngParam
      ? {
          ne_lat: parseFloat(neLatParam),
          ne_lng: parseFloat(neLngParam),
          sw_lat: parseFloat(swLatParam),
          sw_lng: parseFloat(swLngParam),
        }
      : null;

  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    categoryIdParam ? Number(categoryIdParam) : null,
  );

  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const propFiltersRef = useRef<{ properties: number[]; subproperties: number[]; is_special_offer: boolean }>({ properties: [], subproperties: [], is_special_offer: false });

  useEffect(() => {
    categoriesService.getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const fetchRestaurants = useCallback(
    async (
      location: { lat: number; lng: number } | null,
      currentSearch: string,
      currentBbox: { ne_lat: number; ne_lng: number; sw_lat: number; sw_lng: number } | null,
      filters: { properties: number[]; subproperties: number[]; is_special_offer: boolean } = { properties: [], subproperties: [], is_special_offer: false },
      categoryId: number | null = null,
    ) => {
      console.log('[SearchArea] 🔍 fetchRestaurants called with:', {
        mode: currentBbox ? 'BBOX (area search)' : location ? 'GEOLOCATION (nearby)' : 'NO LOCATION',
        currentBbox,
        location,
        search: currentSearch || '(empty)',
        categoryId,
        filters,
      });
      setLoading(true);
      const requestParams = {
        latitude: !currentBbox && location ? location.lat : undefined,
        longitude: !currentBbox && location ? location.lng : undefined,
        ne_lat: currentBbox?.ne_lat,
        ne_lng: currentBbox?.ne_lng,
        sw_lat: currentBbox?.sw_lat,
        sw_lng: currentBbox?.sw_lng,
        search: currentSearch || undefined,
        category_id: categoryId ? [categoryId] : undefined,
        properties: filters.properties.length ? filters.properties : undefined,
        subproperties: filters.subproperties.length ? filters.subproperties : undefined,
        is_special_offer: filters.is_special_offer || undefined,
      };
      console.log('[SearchArea] 📡 Sending request to /nearby-restaurants with params:', requestParams);
      try {
        const res = await placeService.getNearbyRestaurants(requestParams);
        console.log(`[SearchArea] ✅ Got ${res.data?.length ?? 0} restaurants back:`, res.data);
        setRestaurants(res.data ?? []);
      } catch (err) {
        console.error('[SearchArea] ❌ Request failed:', err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    console.log('[SearchArea] 🌐 Places page effect — URL params:', {
      search: search || '(none)',
      bbox,
      activeCategoryId,
    });
    if (bbox) {
      console.log('[SearchArea] ➡️ Path: bbox provided in URL → area search');
      const center = {
        lat: (bbox.ne_lat + bbox.sw_lat) / 2,
        lng: (bbox.ne_lng + bbox.sw_lng) / 2,
      };
      setFocusedLocation(center);
      fetchRestaurants(null, search, bbox, propFiltersRef.current, activeCategoryId);
      return;
    }

    if (userLocationRef.current) {
      console.log('[SearchArea] ➡️ Path: cached user geolocation → nearby search');
      fetchRestaurants(userLocationRef.current, search, null, propFiltersRef.current, activeCategoryId);
      return;
    }
    console.log('[SearchArea] ➡️ Path: requesting browser geolocation…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocationRef.current = loc;
        setUserLocation(loc);
        fetchRestaurants(loc, search, null, propFiltersRef.current, activeCategoryId);
      },
      () => {
        const fallback = { lat: 40.3777, lng: 49.9807 };
        userLocationRef.current = fallback;
        setUserLocation(fallback);
        setLocationError(true);
        fetchRestaurants(fallback, search, null, propFiltersRef.current, activeCategoryId);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, neLatParam, neLngParam, swLatParam, swLngParam, fetchRestaurants, activeCategoryId]);

  const handleCategorySelect = (id: number | null) => {
    setActiveCategoryId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set('category_id', String(id));
    else params.delete('category_id');
    router.replace(`/${lang}/places?${params.toString()}`);
  };

  const handleFilterChange = (filters: { properties: number[]; subproperties: number[]; is_special_offer: boolean }) => {
    propFiltersRef.current = filters;
    if (bbox) {
      fetchRestaurants(null, search, bbox, filters, activeCategoryId);
    } else if (userLocationRef.current) {
      fetchRestaurants(userLocationRef.current, search, null, filters, activeCategoryId);
    }
  };

  const mapLocations: MapLocation[] = restaurants.map((r) => ({
    id: String(r.id),
    title: r.title,
    lat: parseFloat(r.latitude),
    lng: parseFloat(r.longitude),
    slug: r.slug.az || r.slug.en || r.slug.ru || String(r.id),
    lang,
    image: r.image,
    address: r.address,
    distance: r.distance,
  }));

  const handleMarkerClick = (location: MapLocation) => {
    setSelectedSlug(location.slug ?? null);
    if (showMobileMap) setShowMobileMap(false);
    setTimeout(() => {
      document
        .getElementById(`restaurant-${location.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative bg-[#006653] pt-8 pb-12 px-4">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <Image
            src={PlaceBanner}
            alt="Food banner"
            className="w-full h-full object-cover"
            fill
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <SearchBarHeader />
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto py-3 px-4 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                  activeCategoryId === null
                    ? 'bg-[#006653] text-white border-[#006653]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}>
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                    activeCategoryId === cat.id
                      ? 'bg-[#006653] text-white border-[#006653]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}>
                  {cat.icon && (
                    <Image src={cat.icon} alt={cat.title || 'Category'} width={16} height={16} className="w-4 h-4 object-contain" />
                  )}
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Property filter bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: restaurant list */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {search
                  ? `Results for "${search}"`
                  : bbox
                  ? 'Restaurants in selected area'
                  : 'Nearby Restaurants'}
              </h1>
              {!loading && (
                <span className="text-sm text-gray-500">
                  {restaurants.length} restaurants
                </span>
              )}
            </div>

            {locationError && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                Could not detect your location. Showing restaurants in the
                default area.
              </p>
            )}

            <Button
              onClick={() => setShowMobileMap(!showMobileMap)}
              className="lg:hidden w-full bg-[#006653] hover:bg-[#00543f] text-white">
              <MapIcon className="h-4 w-4 mr-2" />
              {showMobileMap ? 'Show List' : 'Show Map'}
            </Button>

            <div
              className={`space-y-4 ${showMobileMap ? 'hidden lg:block' : 'block'}`}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-44 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))
              ) : restaurants.length === 0 ? (
                <p className="text-gray-500 text-center py-12">
                  No restaurants found. Try adjusting your search or filters.
                </p>
              ) : (
                restaurants.map((restaurant) => {
                  const rSlug =
                    restaurant.slug.az ||
                    restaurant.slug.en ||
                    restaurant.slug.ru ||
                    String(restaurant.id);
                  return (
                    <div
                      key={restaurant.id}
                      id={`restaurant-${restaurant.id}`}
                      onClick={() => {
                        setSelectedSlug(rSlug);
                        setFocusedLocation({
                          lat: parseFloat(restaurant.latitude),
                          lng: parseFloat(restaurant.longitude),
                        });
                      }}
                      className={`transition-all duration-300 cursor-pointer ${
                        selectedSlug === rSlug
                          ? 'ring-2 ring-[#006653] rounded-lg shadow-lg'
                          : ''
                      }`}>
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: map (desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-6 h-[600px]">
            <GoogleMap
              locations={mapLocations}
              userLocation={userLocation}
              focusedLocation={focusedLocation}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          {/* Mobile map overlay */}
          {showMobileMap && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <Button
                  onClick={() => setShowMobileMap(false)}
                  variant="outline"
                  className="w-full">
                  Close Map
                </Button>
              </div>
              <div className="flex-1">
                <GoogleMap
                  locations={mapLocations}
                  userLocation={userLocation}
                  focusedLocation={focusedLocation}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PlacesContent />
    </Suspense>
  );
}
