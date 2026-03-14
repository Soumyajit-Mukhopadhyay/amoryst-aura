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

// Custom Premium Icon
const premiumIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRhZjM3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDEwYzAgNy05IDEzLTkgMTNTOyAxNyAzIDEwYTMgMyAwIDAgMSAzLTMgMyAzIDAgMCAxIDMgM2EwIDAgMCAwIDEgMCAwIDMgMyAwIDAgMSAzLTN6Ii8+PFBhdGggZD0iTTEyIDEzYTMgMyAwIDEgMCAwLTYgMyAzIDAgMCAwIDAgNm0wIDAiLz48L3N2Zz4=', // Gold Map Pin
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface SourcingMapProps {
  location: { lat: number; lng: number; name: string; description: string };
  className?: string;
}

export function SourcingMap({ location, className = "" }: SourcingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [location.lat, location.lng],
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      // Add CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstanceRef.current);

      // Add Marker
      markerRef.current = L.marker([location.lat, location.lng], { icon: premiumIcon }).addTo(mapInstanceRef.current);
    }
    
    // Update map position and popup content
    const map = mapInstanceRef.current;
    if (map && markerRef.current) {
      map.flyTo([location.lat, location.lng], 13, { duration: 1.5 });
      markerRef.current.setLatLng([location.lat, location.lng]);
      
      const popupContent = `
        <div class="font-body p-1" style="color: #d4af37">
          <h4 style="font-size: 1.125rem; font-family: 'Playfair Display', serif; margin-bottom: 0.25rem; color: #d4af37;">${location.name}</h4>
          <p style="font-size: 0.75rem; color: rgba(255,255,255,0.8); line-height: 1.4; margin: 0;">${location.description}</p>
        </div>
      `;
      markerRef.current.bindPopup(popupContent, { className: 'premium-popup' });
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-primary/20 ${className}`}>
      <div ref={mapRef} className="w-full h-full z-10" style={{ background: '#1a1a1a' }} />
      {/* Vignette Overlay for premium blending */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-primary/10" />
    </div>
  );
}
