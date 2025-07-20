
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';

// Fix pour les icônes Leaflet avec React
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  onMapClick: (lat: number, lon: number) => void;
}

export interface MapViewRef {
  flyToLocation: (lat: number, lon: number) => void;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ onMapClick }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Function to create a marker (reusable for both click and search)
  const createMarker = (lat: number, lng: number) => {
    if (!mapInstance.current) return;

    // Remove previous marker if it exists
    if (markerRef.current) {
      mapInstance.current.removeLayer(markerRef.current);
    }

    // Create new marker
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(mapInstance.current);
    
    markerRef.current = marker;
    return marker;
  };

  // Expose flyToLocation method via ref
  useImperativeHandle(ref, () => ({
    flyToLocation: (lat: number, lon: number) => {
      if (mapInstance.current) {
        createMarker(lat, lon);
        mapInstance.current.flyTo([lat, lon], 16, { animate: true, duration: 1.5 });
        onMapClick(lat, lon);
      }
    }
  }));

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialiser la carte
    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);
    // Ajouter la couche de tuiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Gérer les clics sur la carte
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      createMarker(lat, lng);
      // Zoomer sur le point cliqué en douceur
      map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      
      onMapClick(lat, lng);
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-full cursor-crosshair"
      style={{ background: '#a7c5bd' }}
    />
  );
});

MapView.displayName = 'MapView';

export default MapView;
