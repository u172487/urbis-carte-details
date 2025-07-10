
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix pour les icônes Leaflet avec React
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  onMapClick: (lat: number, lon: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialiser la carte
    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

    // Ajouter la couche de tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Gérer les clics sur la carte
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onMapClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full cursor-crosshair"
      style={{ background: '#a7c5bd' }}
    />
  );
};

export default MapView;
