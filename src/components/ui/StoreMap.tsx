import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Premium Icons
const defaultIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2MwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iI2NjMDAwMCIvPjwvc3ZnPg==', 
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

const activeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRhZjM3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNkNGFmMzciLz48L3N2Zz4=', 
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
}

interface StoreMapProps {
  stores: StoreLocation[];
  activeStore: StoreLocation | null;
  onMarkerClick: (store: StoreLocation) => void;
  className?: string;
}

export function StoreMap({ stores, activeStore, onMarkerClick, className = "" }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map with a lighter theme focus on India
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 4,
        zoomControl: true, // Allow zoom for better UX
        scrollWheelZoom: false, // Prevent accidental scrolling
      });

      // CartoDB Positron (Light/CleanTheme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstanceRef.current);
    }
    
    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    stores.forEach(store => {
      const isActive = activeStore?.id === store.id;
      const marker = L.marker([store.lat, store.lng], { 
        icon: isActive ? activeIcon : defaultIcon,
        zIndexOffset: isActive ? 1000 : 0
      }).addTo(map);

      marker.on('click', () => {
        onMarkerClick(store);
      });

      const popupContent = `
        <div class="font-body p-1" style="color: #333">
          <h4 style="font-size: 1.125rem; font-family: 'Playfair Display', serif; margin-bottom: 0.25rem; color: #d4af37;">${store.name}</h4>
          <p style="font-size: 0.8rem; color: #666; line-height: 1.4; margin: 0;">${store.address}, ${store.city}</p>
        </div>
      `;
      marker.bindPopup(popupContent, { className: 'light-premium-popup' });
      
      if (isActive) {
        marker.openPopup();
      }

      markersRef.current[store.id] = marker;
    });

  }, [stores, activeStore, onMarkerClick]);

  // Handle flying to active store
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && activeStore) {
      map.flyTo([activeStore.lat, activeStore.lng], 14, { duration: 1.5, easeLinearity: 0.25 });
    } else if (map && stores.length > 0) {
      // Reset view if no active store
      const latitudes = stores.map(s => s.lat);
      const longitudes = stores.map(s => s.lng);
      map.fitBounds([
        [Math.min(...latitudes), Math.min(...longitudes)],
        [Math.max(...latitudes), Math.max(...longitudes)]
      ], { padding: [50, 50], duration: 1 });
    }
  }, [activeStore]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-[#FAF9F5] shadow-lg ${className}`}>
      <div ref={mapRef} className="w-full h-full z-10" />
    </div>
  );
}
