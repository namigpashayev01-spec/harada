'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

export interface MapLocation {
  id: string;
  title: string;
  lat: number;
  lng: number;
  slug?: string;
  lang?: string;
  image?: string;
  address?: string;
  distance?: number;
}

interface GoogleMapProps {
  locations: MapLocation[];
  userLocation?: { lat: number; lng: number } | null;
  focusedLocation?: { lat: number; lng: number } | null;
  onMarkerClick?: (location: MapLocation) => void;
}

export default function GoogleMap({
  locations,
  userLocation,
  focusedLocation,
  onMarkerClick,
}: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Poll for window.google — script is loaded at layout level
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }
    let cancelled = false;
    const poll = () => {
      if (cancelled) return;
      if (window.google?.maps) {
        setIsLoaded(true);
      } else {
        requestAnimationFrame(poll);
      }
    };
    requestAnimationFrame(poll);
    return () => { cancelled = true; };
  }, []);

  // Inject styles to clean up the default InfoWindow chrome
  useEffect(() => {
    if (!isLoaded) return;
    const el = document.createElement('style');
    el.id = 'gmap-iw-override';
    if (!document.getElementById('gmap-iw-override')) {
      el.textContent = `
        .gm-style-iw-c { padding: 0 !important; border-radius: 14px !important; box-shadow: 0 12px 32px rgba(0,0,0,0.18) !important; }
        .gm-style-iw-d { overflow: hidden !important; padding: 0 !important; }
        .gm-style-iw-tc { display: none !important; }
        .gm-ui-hover-effect {
          top: 8px !important; right: 8px !important;
          width: 28px !important; height: 28px !important;
          background: #fff !important; border-radius: 50% !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
          opacity: 1 !important; display: flex !important;
          align-items: center !important; justify-content: center !important;
        }
        .gm-ui-hover-effect > span {
          width: 12px !important; height: 12px !important;
          background-color: #444 !important;
        }
      `;
      document.head.appendChild(el);
    }
  }, [isLoaded]);

  // Init map once google is ready
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;
    const center = userLocation ?? { lat: 40.3777, lng: 49.9807 };
    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });
  }, [isLoaded, userLocation]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;

    // User location marker — shown visually but NOT included in fitBounds
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#4285f4',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
        title: 'Your location',
        zIndex: 999,
      });
    }

    locations.forEach((location) => {
      const pos = { lat: location.lat, lng: location.lng };

      const marker = new window.google.maps.Marker({
        position: pos,
        map: mapRef.current,
        title: location.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: '#2F4F4F',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2.5,
        },
      });

      const imageHtml = location.image
        ? `<div style="width:100%;height:120px;overflow:hidden;flex-shrink:0;border-radius:14px 14px 0 0;">
             <img src="${location.image}" alt="${location.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
           </div>`
        : '';

      const addressHtml = location.address
        ? `<p style="margin:0 0 2px;font-size:11px;color:#999;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${location.address}</p>`
        : '';

      const distanceHtml = location.distance != null
        ? `<span style="display:inline-block;margin-top:4px;font-size:10px;font-weight:600;color:#CD7F4E;background:#FDF3EC;padding:2px 8px;border-radius:20px;">${location.distance.toFixed(1)} km</span>`
        : '';

      const linkHref = location.slug
        ? `/${location.lang ?? 'en'}/places/${location.slug}`
        : '#';

      const cardHtml = `
        <div style="
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          width:220px;
          border-radius:14px;
          overflow:hidden;
          background:#fff;
        ">
          ${imageHtml}
          <div style="padding:12px 14px 14px;">
            <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1a1a1a;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${location.title}</p>
            ${addressHtml}
            ${distanceHtml}
            <a
              href="${linkHref}"
              style="
                display:block;
                margin-top:12px;
                text-align:center;
                background:#2F4F4F;
                color:#fff;
                padding:9px 0;
                border-radius:8px;
                font-size:12px;
                font-weight:600;
                text-decoration:none;
                letter-spacing:0.3px;
              "
            >View Details →</a>
          </div>
        </div>`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: cardHtml,
        disableAutoPan: false,
        pixelOffset: new window.google.maps.Size(0, -4),
      });

      marker.addListener('click', () => {
        infoWindow.open(mapRef.current, marker);
        if (onMarkerClick) onMarkerClick(location);
      });

      markersRef.current.push(marker);
      bounds.extend(pos);
      hasPoints = true;
    });

    if (hasPoints && locations.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: 60 });
    }
  }, [locations, isLoaded, userLocation, onMarkerClick]);

  // Pan + zoom to a restaurant when a card is clicked
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !focusedLocation) return;
    mapRef.current.panTo({ lat: focusedLocation.lat, lng: focusedLocation.lng });
    mapRef.current.setZoom(15);
  }, [focusedLocation, isLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-[#2F4F4F]" />
          <p className="text-sm text-gray-500">Loading map…</p>
        </div>
      )}
    </div>
  );
}
